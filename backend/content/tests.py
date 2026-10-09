from io import StringIO
import json
from unittest.mock import patch

from django.core.cache import cache
from django.core.management import call_command
from django.contrib.auth import get_user_model
from django.test import SimpleTestCase, TestCase, override_settings
from django.urls import reverse

from .models import Announcement, Concept, ContentItem, Opportunity, Resource, Skill, Subject


class FeedbackEmailApiTests(SimpleTestCase):
    @patch.dict(
        "os.environ",
        {
            "RESEND_API_KEY": "re_test_key",
            "FEEDBACK_FROM_EMAIL": "Stemawy <feedback@example.test>",
            "FEEDBACK_TO_EMAIL": "inbox@example.test",
        },
    )
    @patch("content.views.urllib.request.urlopen")
    def test_feedback_uses_resend_https_api(self, urlopen):
        urlopen.return_value.__enter__.return_value.read.return_value = b"{}"
        response = self.client.post(
            "/api/feedback/",
            data=json.dumps(
                {
                    "feedbackType": "general",
                    "message": "A valid feedback message for testing delivery.",
                    "email": "reply@example.test",
                    "companyWebsite": "",
                    "resources": [],
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 202)
        request = urlopen.call_args.args[0]
        self.assertEqual(request.full_url, "https://api.resend.com/emails")
        self.assertEqual(request.get_header("Authorization"), "Bearer re_test_key")
        self.assertEqual(json.loads(request.data)["reply_to"], "reply@example.test")

    @patch.dict("os.environ", {}, clear=True)
    @patch("content.views.urllib.request.urlopen")
    def test_missing_resend_configuration_returns_503(self, urlopen):
        response = self.client.post(
            "/api/feedback/",
            data=json.dumps(
                {
                    "feedbackType": "general",
                    "message": "A valid feedback message for testing delivery.",
                    "email": "",
                    "companyWebsite": "",
                    "resources": [],
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json()["error"], "delivery_not_configured")
        urlopen.assert_not_called()


@override_settings(
    CACHES={
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "stemawy-catalog-tests",
        }
    }
)
class CatalogApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("import_migrated_data", "--apply", stdout=StringIO())
        get_user_model().objects.create_superuser(
            username="catalog-admin",
            email="catalog-admin@example.test",
            password="test-only-password",
        )

    def setUp(self):
        cache.clear()
        self.client.force_login(get_user_model().objects.get(username="catalog-admin"))

    def test_catalogs_are_imported(self):
        self.assertEqual(Subject.objects.count(), 42)
        self.assertEqual(Opportunity.objects.count(), 26)
        self.assertEqual(Skill.objects.count(), 17)
        self.assertGreater(Resource.objects.count(), 3000)

    def test_preview_does_not_change_database(self):
        before = (
            Subject.objects.count(),
            Opportunity.objects.count(),
            Skill.objects.count(),
            Resource.objects.count(),
        )
        call_command("import_migrated_data", stdout=StringIO())
        after = (
            Subject.objects.count(),
            Opportunity.objects.count(),
            Skill.objects.count(),
            Resource.objects.count(),
        )
        self.assertEqual(after, before)

    def test_replace_curriculum_rebuilds_only_curriculum_tables(self):
        manual_subject = Subject.objects.create(
            name="Admin-only subject",
            grade=10,
            semester=1,
        )
        manual_resource = Resource.objects.create(
            title="Admin-only resource",
            type="video",
            url="https://example.test/admin-only",
        )
        opportunity = Opportunity.objects.get(pk="yyas")
        opportunity.title = "Keep this admin edit"
        opportunity.save()
        skill = Skill.objects.get(pk="test-your-writing-speed")
        skill.title = "Keep this skill edit"
        skill.save()

        call_command(
            "import_migrated_data",
            "--replace-curriculum",
            "--apply",
            stdout=StringIO(),
        )

        self.assertEqual(Subject.objects.count(), 42)
        self.assertEqual(ContentItem.objects.count(), 246)
        self.assertEqual(Concept.objects.count(), 832)
        self.assertEqual(Resource.objects.count(), 3249)
        self.assertFalse(Subject.objects.filter(pk=manual_subject.pk).exists())
        self.assertFalse(Resource.objects.filter(pk=manual_resource.pk).exists())
        self.assertEqual(Opportunity.objects.get(pk="yyas").title, "Keep this admin edit")
        self.assertEqual(Skill.objects.get(pk=skill.pk).title, "Keep this skill edit")

    def test_reimport_is_idempotent_and_preserves_admin_edits(self):
        opportunity = Opportunity.objects.get(pk="yyas")
        opportunity.title = "Admin-edited opportunity"
        opportunity.save()
        opportunity_with_custom_image = Opportunity.objects.get(pk="ala")
        opportunity_with_custom_image.image_url = "https://example.test/admin-image.jpg"
        opportunity_with_custom_image.save()

        call_command("import_migrated_data", "--apply", stdout=StringIO())
        call_command("import_migrated_data", "--apply", stdout=StringIO())

        opportunity.refresh_from_db()
        opportunity_with_custom_image.refresh_from_db()
        self.assertEqual(opportunity.title, "Admin-edited opportunity")
        self.assertTrue(opportunity.image_url)
        self.assertEqual(
            opportunity_with_custom_image.image_url,
            "https://example.test/admin-image.jpg",
        )
        self.assertTrue(
            all(item.image_url for item in Opportunity.objects.all())
        )
        self.assertEqual(Subject.objects.count(), 42)
        self.assertEqual(Opportunity.objects.count(), 26)
        self.assertEqual(Skill.objects.count(), 17)

    def test_catalog_endpoints_return_frontend_payloads(self):
        subject_response = self.client.get(
            "/api/subjects/?grade=10&semester=1"
        )
        opportunity_response = self.client.get("/api/opportunities/")
        skill_response = self.client.get("/api/skills/")

        self.assertEqual(subject_response.status_code, 200)
        self.assertEqual(opportunity_response.status_code, 200)
        self.assertEqual(skill_response.status_code, 200)
        self.assertTrue(subject_response.json()["subjects"])
        self.assertEqual(len(opportunity_response.json()["opportunities"]), 26)
        self.assertEqual(len(skill_response.json()["skills"]), 17)

    def test_announcements_endpoint_returns_only_published_bilingual_items(self):
        published = Announcement.objects.create(
            title="Exam schedule",
            ar_title="جدول الامتحانات",
            message="The exam schedule is available.",
            ar_message="جدول الامتحانات متاح.",
            link_url="https://example.test/exams",
        )
        Announcement.objects.create(
            title="Draft announcement",
            message="This is not published.",
            is_published=False,
        )

        response = self.client.get("/api/announcements/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()["announcements"],
            [
                {
                    "id": published.pk,
                    "title": "Exam schedule",
                    "arTitle": "جدول الامتحانات",
                    "message": "The exam schedule is available.",
                    "arMessage": "جدول الامتحانات متاح.",
                    "href": "https://example.test/exams",
                    "createdAt": published.created_at.isoformat(),
                }
            ],
        )

    def test_announcement_admin_add_form_loads(self):
        response = self.client.get(reverse("admin:content_announcement_add"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'name="ar_title"')

    def test_saving_announcement_invalidates_cached_endpoint(self):
        first = self.client.get("/api/announcements/")
        self.assertEqual(first.json()["announcements"], [])

        Announcement.objects.create(title="New update", message="A new update.")

        refreshed = self.client.get("/api/announcements/")
        self.assertEqual(len(refreshed.json()["announcements"]), 1)

    def test_resource_playlist_label_is_preserved(self):
        playlist = Resource.objects.get(
            pk="maths-g10-s1-video-similarity-c1d44ff03a"
        )
        self.assertEqual(playlist.link_text, "see the whole playlist")

    def test_search_reads_database_catalogs(self):
        response = self.client.get("/api/search/?q=YYAS&lang=en")
        self.assertEqual(response.status_code, 200)
        groups = response.json()["groups"]
        opportunities = next(
            group for group in groups if group["type"] == "opportunity"
        )
        self.assertEqual(opportunities["results"][0]["id"], "yyas")

    def test_admin_save_invalidates_cached_catalog_response(self):
        first = self.client.get("/api/opportunities/")
        self.assertEqual(first.status_code, 200)

        opportunity = Opportunity.objects.get(pk="yyas")
        opportunity.title = "Updated by admin"
        opportunity.save()

        refreshed = self.client.get("/api/opportunities/")
        titles = [item["title"] for item in refreshed.json()["opportunities"]]
        self.assertIn("Updated by admin", titles)

    def test_catalog_api_is_read_only(self):
        response = self.client.post("/api/skills/", data={"title": "Not allowed"})
        self.assertEqual(response.status_code, 405)

    def test_admin_add_subject_page_and_edit_forms_load(self):
        subject_response = self.client.get(reverse("admin:content_subject_add"))
        self.assertEqual(subject_response.status_code, 200)
        self.assertNotContains(subject_response, 'name="id"')

        content_item = ContentItem.objects.first()
        concept = Concept.objects.first()
        content_response = self.client.get(
            reverse("admin:content_contentitem_change", args=[content_item.pk])
        )
        concept_response = self.client.get(
            reverse("admin:content_concept_change", args=[concept.pk])
        )

        self.assertEqual(content_response.status_code, 200)
        self.assertEqual(concept_response.status_code, 200)

    def test_all_catalog_add_forms_hide_generated_id(self):
        for model_name in (
            "subject",
            "contentitem",
            "concept",
            "resource",
            "opportunity",
            "skill",
        ):
            with self.subTest(model=model_name):
                response = self.client.get(
                    reverse(f"admin:content_{model_name}_add")
                )
                self.assertEqual(response.status_code, 200)
                self.assertNotContains(response, 'name="id"')

    def test_subject_and_skill_icons_are_dropdowns(self):
        subject_response = self.client.get(reverse("admin:content_subject_add"))
        skill_response = self.client.get(reverse("admin:content_skill_add"))

        self.assertContains(subject_response, '<select name="icon"')
        self.assertContains(skill_response, '<select name="icon"')

    def test_models_generate_stable_unique_ids(self):
        subject = Subject.objects.create(
            name="Generated Maths",
            grade=10,
            semester=1,
        )
        self.assertEqual(subject.id, "generated-maths-g10-s1")

        first_unit = ContentItem.objects.create(
            subject=subject,
            type="unit",
            title="Linear Equations",
            display_order=1,
        )
        second_unit = ContentItem.objects.create(
            subject=subject,
            type="unit",
            title="Linear Equations",
            display_order=1,
        )
        self.assertEqual(
            first_unit.id,
            "generated-maths-g10-s1-unit-01-linear-equations",
        )
        self.assertEqual(
            second_unit.id,
            "generated-maths-g10-s1-unit-01-linear-equations-2",
        )

        concept = Concept.objects.create(
            content_item=first_unit,
            title="Balancing both sides",
        )
        resource = Resource.objects.create(
            title="Equation lesson",
            type="video",
            url="https://example.com/equation-lesson",
        )
        opportunity = Opportunity.objects.create(
            title="Young Scientists",
            description="A sample opportunity.",
            url="https://example.com/opportunity",
            category="research",
            opportunity_type="Research Program",
        )
        skill = Skill.objects.create(
            title="Study planning",
            url="https://example.com/study-planning",
            category="productivity",
            skill_type="tool",
        )

        self.assertEqual(
            concept.id,
            "generated-maths-g10-s1-unit-01-linear-equations-concept-balancing-both-sides",
        )
        self.assertEqual(resource.id, "resource-equation-lesson")
        self.assertEqual(opportunity.id, "opportunity-young-scientists")
        self.assertEqual(skill.id, "skill-study-planning")
