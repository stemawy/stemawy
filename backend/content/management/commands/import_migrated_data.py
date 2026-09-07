import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from content.models import Concept, ContentItem, Resource, Subject


def category_for_subject(subject_id):
    if any(
        subject_id.startswith(prefix)
        for prefix in ("physics-", "chemistry-", "biology-", "geology-", "maths-", "mechanics-")
    ):
        return "science"
    if any(
        subject_id.startswith(prefix)
        for prefix in ("arabic-", "english-", "german-", "french-")
    ):
        return "languages"
    if subject_id.startswith("computerscience-") or subject_id.startswith("computer-science-"):
        return "computing"
    return "humanities"


class Command(BaseCommand):
    help = "Import generated Stemawy migration JSON into the Django database."

    def add_arguments(self, parser):
        parser.add_argument(
            "--source",
            default=None,
            help="Directory containing migrated JSON files. Defaults to ../data/generated/migrated.",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete existing content before importing.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        source = (
            Path(options["source"])
            if options["source"]
            else Path(__file__).resolve().parents[4]
            / "data"
            / "generated"
            / "migrated"
        )

        files = sorted(source.rglob("*.json")) if source.exists() else []
        if not files:
            raise CommandError(f"No migrated JSON files found in {source}")

        if options["clear"]:
            Concept.objects.all().delete()
            ContentItem.objects.all().delete()
            Resource.objects.all().delete()
            Subject.objects.all().delete()

        counts = {"subjects": 0, "content": 0, "concepts": 0, "resources": 0}
        pending_content_resources = {}
        pending_concept_resources = {}

        for file_path in files:
            with file_path.open(encoding="utf-8") as file:
                dataset = json.load(file)

            subject_data = dataset["subject"]
            subject, _ = Subject.objects.update_or_create(
                id=subject_data["id"],
                defaults={
                    "name": subject_data["name"].strip(),
                    "description": subject_data.get("description", ""),
                    "grade": int(subject_data["grade"]),
                    "semester": int(subject_data["semester"]),
                    "category": category_for_subject(subject_data["id"]),
                    "icon": subject_data.get("icon", "book-open"),
                    "display_order": subject_data.get("order", 0),
                },
            )
            counts["subjects"] += 1

            content_by_id = {}
            for content_data in subject_data.get("content", []):
                item, _ = ContentItem.objects.update_or_create(
                    id=content_data["id"],
                    defaults={
                        "subject": subject,
                        "type": content_data["type"],
                        "title": content_data["title"],
                        "description": content_data.get("description", ""),
                        "display_order": content_data.get("order", 0),
                    },
                )
                content_by_id[item.id] = item
                counts["content"] += 1

                for concept_data in content_data.get("concepts", []):
                    concept, _ = Concept.objects.update_or_create(
                        id=concept_data["id"],
                        defaults={
                            "content_item": item,
                            "title": concept_data["title"],
                            "description": concept_data.get("description", ""),
                            "display_order": concept_data.get("order", 0),
                        },
                    )
                    counts["concepts"] += 1
                    pending_concept_resources[concept.id] = concept_data.get(
                        "resources", []
                    )

                pending_content_resources[item.id] = content_data.get("resources", [])

            for resource_data in dataset.get("resources", []):
                resource, _ = Resource.objects.update_or_create(
                    id=resource_data["id"],
                    defaults={
                        "title": resource_data["title"],
                        "type": resource_data["type"],
                        "provider": resource_data.get("provider", ""),
                        "url": resource_data.get("url") or "https://invalid.local/legacy",
                        "youtube_id": resource_data.get("youtubeId", ""),
                        "legacy_path": resource_data.get("source", {}).get("legacyPath", ""),
                        "location": resource_data.get("source", {}).get("location", ""),
                        "classification": resource_data.get("classification", {}).get("status", ""),
                        "content_type": resource_data.get("classification", {}).get("contentType", "") or "",
                    },
                )
                counts["resources"] += 1

            for item_id, resource_ids in pending_content_resources.items():
                ContentItem.objects.get(id=item_id).resources.set(
                    Resource.objects.filter(id__in=resource_ids)
                )

            for concept_id, resource_ids in pending_concept_resources.items():
                Concept.objects.get(id=concept_id).resources.set(
                    Resource.objects.filter(id__in=resource_ids)
                )

        self.stdout.write(
            self.style.SUCCESS(
                "Imported "
                + ", ".join(f"{value} {key}" for key, value in counts.items())
            )
        )
