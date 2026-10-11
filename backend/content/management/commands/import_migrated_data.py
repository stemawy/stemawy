import json
import hashlib
from collections import Counter
from pathlib import Path

from django.core.cache import cache
from django.core.management.base import BaseCommand, CommandError
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.db import transaction

from content.models import Concept, ContentItem, Opportunity, Resource, Skill, Subject


PROJECT_ROOT = Path(__file__).resolve().parents[4]
URL_VALIDATOR = URLValidator(schemes=("http", "https"))


def category_for_subject(subject_id):
    if any(
        subject_id.startswith(prefix)
        for prefix in (
            "physics-",
            "chemistry-",
            "biology-",
            "geology-",
            "maths-",
            "mechanics-",
        )
    ):
        return "science"
    if any(
        subject_id.startswith(prefix)
        for prefix in ("arabic-", "english-", "german-", "french-")
    ):
        return "languages"
    if subject_id.startswith("computerscience-") or subject_id.startswith(
        "computer-science-"
    ):
        return "computing"
    return "humanities"


def load_json(path):
    try:
        with path.open(encoding="utf-8") as file:
            return json.load(file)
    except (OSError, json.JSONDecodeError) as error:
        raise CommandError(f"Could not read valid JSON from {path}: {error}") from error


def require_unique_ids(rows, label):
    ids = [str(row.get("id", "")).strip() for row in rows]
    missing = sum(not item_id for item_id in ids)
    duplicates = [item_id for item_id, count in Counter(ids).items() if count > 1]
    if missing or duplicates:
        raise CommandError(
            f"Invalid {label} catalog: {missing} missing IDs; "
            f"duplicate IDs: {duplicates[:10]}"
        )


def validate_url(value, label):
    try:
        URL_VALIDATOR(value)
    except ValidationError as error:
        raise CommandError(f"Invalid URL for {label}: {value!r}") from error


def add_unique(mapping, item_id, value, label):
    if item_id in mapping:
        raise CommandError(f"Duplicate {label} ID in source data: {item_id}")
    mapping[item_id] = value


def through_fields(through_model, left_model, right_model):
    relation_fields = {
        field.remote_field.model: field.name
        for field in through_model._meta.fields
        if field.is_relation and field.remote_field
    }
    return relation_fields[left_model], relation_fields[right_model]


class Command(BaseCommand):
    help = "Safely preview or add missing catalog records without overwriting admin data."

    def add_arguments(self, parser):
        parser.add_argument(
            "--source",
            type=Path,
            default=PROJECT_ROOT / "data" / "generated" / "migrated",
            help="Directory containing migrated subject JSON files.",
        )
        parser.add_argument(
            "--seed",
            type=Path,
            default=PROJECT_ROOT / "data" / "catalog-seed",
            help="Directory containing exported opportunity and skill seed JSON.",
        )
        parser.add_argument(
            "--apply",
            action="store_true",
            help="Apply the additive import. Without this flag, only a preview is shown.",
        )
        parser.add_argument(
            "--replace-curriculum",
            action="store_true",
            help=(
                "Replace all subjects, content items, concepts, and resources "
                "from the source files. Opportunities and skills are left unchanged."
            ),
        )

    def handle(self, *args, **options):
        datasets = self.load_subject_datasets(options["source"])
        opportunities = load_json(options["seed"] / "opportunities.json")
        skills = load_json(options["seed"] / "skills.json")
        catalog = self.build_catalog(datasets, opportunities, skills)
        self.validate_catalog(catalog)
        replace_curriculum = options["replace_curriculum"]
        plan = self.build_plan(catalog, replace_curriculum)
        self.report_plan(plan, options["apply"], replace_curriculum)

        if not options["apply"]:
            self.stdout.write("Preview only; no database records were changed.")
            if replace_curriculum:
                self.stdout.write(
                    "Run again with --replace-curriculum --apply to replace curriculum data."
                )
            else:
                self.stdout.write("Run again with --apply to add missing records.")
            return

        with transaction.atomic():
            if replace_curriculum:
                Subject.objects.all().delete()
                Resource.objects.all().delete()
            self.apply_catalog(catalog, plan)
            if not replace_curriculum:
                self.fill_missing_opportunity_images(plan)
        cache.clear()

        self.stdout.write(self.style.SUCCESS("Catalog import completed."))
        self.stdout.write(
            f"Database totals: {Subject.objects.count()} subjects, "
            f"{ContentItem.objects.count()} content items, "
            f"{Concept.objects.count()} concepts, {Resource.objects.count()} resources, "
            f"{Opportunity.objects.count()} opportunities, {Skill.objects.count()} skills."
        )

    def load_subject_datasets(self, source):
        files = sorted(source.rglob("*.json")) if source.exists() else []
        if not files:
            raise CommandError(f"No migrated subject JSON files found in {source}")
        datasets = [load_json(path) for path in files]
        if any(not isinstance(item.get("subject"), dict) for item in datasets):
            raise CommandError("Every migrated dataset must contain a subject object.")
        return datasets

    def build_catalog(self, datasets, opportunities, skills):
        catalog = {
            "subjects": {},
            "content": {},
            "concepts": {},
            "resources": {},
            "opportunities": opportunities,
            "skills": skills,
            "content_resource_links": set(),
            "concept_resource_links": set(),
        }
        seen_concept_ids = set()

        for dataset in datasets:
            subject = dataset["subject"]
            add_unique(catalog["subjects"], subject["id"], subject, "subject")
            for content in subject.get("content", []):
                add_unique(
                    catalog["content"],
                    content["id"],
                    (subject["id"], content),
                    "content item",
                )
                catalog["content_resource_links"].update(
                    (content["id"], resource_id)
                    for resource_id in content.get("resources", [])
                    if resource_id
                )
                for concept_index, source_concept in enumerate(
                    content.get("concepts", [])
                ):
                    concept = dict(source_concept)
                    concept_id = str(concept.get("id", "")).strip()
                    if not concept_id or concept_id in ("-", "concept"):
                        concept_id = f"{content['id']}-concept-{concept_index + 1:02d}"

                    if concept_id in seen_concept_ids:
                        identity = f"{content['id']}:{concept_index}:{concept_id}"
                        suffix = hashlib.sha256(identity.encode("utf-8")).hexdigest()[:12]
                        concept_id = f"{concept_id[:220]}-{suffix}"

                    collision = 2
                    base_id = concept_id
                    while concept_id in seen_concept_ids:
                        concept_id = f"{base_id[:230]}-{collision}"
                        collision += 1

                    concept["id"] = concept_id
                    seen_concept_ids.add(concept_id)
                    add_unique(
                        catalog["concepts"],
                        concept_id,
                        (content["id"], concept),
                        "concept",
                    )
                    catalog["concept_resource_links"].update(
                        (concept["id"], resource_id)
                        for resource_id in concept.get("resources", [])
                        if resource_id
                    )
            for resource in dataset.get("resources", []):
                add_unique(
                    catalog["resources"],
                    resource["id"],
                    resource,
                    "resource",
                )

        for label in ("opportunities", "skills"):
            if not isinstance(catalog[label], list):
                raise CommandError(f"The {label} seed must contain a JSON array.")
            require_unique_ids(catalog[label], label)

        for label in ("subjects", "content", "concepts", "resources"):
            ids = list(catalog[label])
            if len(ids) != len(set(ids)):
                raise CommandError(f"Duplicate IDs found in the {label} source.")

        return catalog

    def validate_catalog(self, catalog):
        resource_types = {value for value, _ in Resource.TYPE_CHOICES}
        opportunity_categories = {value for value, _ in Opportunity.CATEGORY_CHOICES}
        opportunity_types = {value for value, _ in Opportunity.TYPE_CHOICES}
        skill_categories = {value for value, _ in Skill.CATEGORY_CHOICES}
        skill_types = {value for value, _ in Skill.TYPE_CHOICES}

        for resource in catalog["resources"].values():
            if resource.get("type") not in resource_types:
                raise CommandError(
                    f"Unknown resource type {resource.get('type')!r} "
                    f"for {resource.get('id')!r}. Update Resource.TYPE_CHOICES first."
                )
            raw_url = resource.get("url", "")
            url = raw_url.get("url", "") if isinstance(raw_url, dict) else raw_url
            validate_url(url, resource.get("id", "resource"))

        for opportunity in catalog["opportunities"]:
            if opportunity.get("category") not in opportunity_categories:
                raise CommandError(f"Unknown opportunity category in {opportunity['id']!r}.")
            if opportunity.get("opportunity_type") not in opportunity_types:
                raise CommandError(f"Unknown opportunity type in {opportunity['id']!r}.")
            validate_url(opportunity.get("url", ""), opportunity["id"])

        for skill in catalog["skills"]:
            if skill.get("category") not in skill_categories:
                raise CommandError(f"Unknown skill category in {skill['id']!r}.")
            if skill.get("skill_type") not in skill_types:
                raise CommandError(f"Unknown skill type in {skill['id']!r}.")
            validate_url(skill.get("url", ""), skill["id"])

        for subject_id, data in catalog["subjects"].items():
            self.validate_model(
                Subject(
                    id=subject_id,
                    name=str(data.get("name", "")).strip(),
                    description=data.get("description", "") or "",
                    grade=int(str(data["grade"]).removeprefix("Grade ")),
                    semester=int(str(data["semester"]).removeprefix("Semester ")),
                    category=category_for_subject(subject_id),
                    icon=data.get("icon") or "book-open",
                    display_order=data.get("order") or 0,
                ),
                subject_id,
            )

        for item_id, (subject_id, data) in catalog["content"].items():
            self.validate_model(
                ContentItem(
                    id=item_id,
                    subject_id=subject_id,
                    type=data.get("type"),
                    title=data.get("title"),
                    description=data.get("description") or "",
                    display_order=data.get("order") or 0,
                    show_resource_suggestion=not any(
                        resource_id is False for resource_id in data.get("resources", [])
                    ),
                ),
                item_id,
                exclude=("subject",),
            )

        for concept_id, (content_id, data) in catalog["concepts"].items():
            self.validate_model(
                Concept(
                    id=concept_id,
                    content_item_id=content_id,
                    title=data.get("title"),
                    description=data.get("description") or "",
                    display_order=data.get("order") or 0,
                ),
                concept_id,
                exclude=("content_item",),
            )

        for data in catalog["resources"].values():
            raw_url = data.get("url", "")
            url = raw_url.get("url", "") if isinstance(raw_url, dict) else raw_url
            source = data.get("source") or {}
            classification = data.get("classification") or {}
            self.validate_model(
                Resource(
                    id=data["id"],
                    title=data.get("title"),
                    type=data.get("type"),
                    provider=data.get("provider") or "",
                    url=url,
                    link_text=(raw_url.get("text", "") if isinstance(raw_url, dict) else "") or "",
                    image_url=data.get("imageUrl") or "",
                    youtube_id=data.get("youtubeId") or "",
                    legacy_path=source.get("legacyPath") or "",
                    location=source.get("location") or "",
                    classification=classification.get("status") or "",
                    content_type=classification.get("contentType") or "",
                ),
                data["id"],
            )

        for data in catalog["opportunities"]:
            self.validate_model(Opportunity(**data), data["id"])

        for data in catalog["skills"]:
            self.validate_model(Skill(**data), data["id"])

    def validate_model(self, instance, item_id, exclude=()):
        try:
            instance.full_clean(
                validate_unique=False,
                validate_constraints=False,
                exclude=exclude,
            )
        except ValidationError as error:
            raise CommandError(f"Invalid source record {item_id!r}: {error}") from error

    def build_plan(self, catalog, replace_curriculum=False):
        model_catalogs = {
            "subjects": (Subject, set(catalog["subjects"])),
            "content": (ContentItem, set(catalog["content"])),
            "concepts": (Concept, set(catalog["concepts"])),
            "resources": (Resource, set(catalog["resources"])),
        }
        plan = {}
        for label, (model, source_ids) in model_catalogs.items():
            existing_ids = set(model.objects.values_list("id", flat=True))
            plan[label] = {
                "new": source_ids if replace_curriculum else source_ids - existing_ids,
                "preserved": set() if replace_curriculum else source_ids & existing_ids,
            }

        if replace_curriculum:
            plan["deletions"] = {
                "subjects": Subject.objects.count(),
                "content": ContentItem.objects.count(),
                "concepts": Concept.objects.count(),
                "resources": Resource.objects.count(),
            }
            plan["opportunities_unchanged"] = Opportunity.objects.count()
            plan["skills_unchanged"] = Skill.objects.count()
            plan["opportunities"] = {"new": set(), "preserved": set()}
            plan["skills"] = {"new": set(), "preserved": set()}
            plan["opportunity_images"] = {}
        else:
            for label, model, source_ids in (
                (
                    "opportunities",
                    Opportunity,
                    {item["id"] for item in catalog["opportunities"]},
                ),
                ("skills", Skill, {item["id"] for item in catalog["skills"]}),
            ):
                existing_ids = set(model.objects.values_list("id", flat=True))
                plan[label] = {
                    "new": source_ids - existing_ids,
                    "preserved": source_ids & existing_ids,
                }
            existing_images = dict(
                Opportunity.objects.values_list("id", "image_url")
            )
            plan["opportunity_images"] = {
                item["id"]: item["image_url"]
                for item in catalog["opportunities"]
                if item.get("image_url")
                and item["id"] in existing_images
                and not existing_images[item["id"]]
            }

        source_resource_ids = set(catalog["resources"])
        all_resource_ids = set(source_resource_ids)
        if not replace_curriculum:
            all_resource_ids.update(Resource.objects.values_list("id", flat=True))
        plan["content_resource_links"] = self.new_link_count(
            ContentItem.resources.through,
            ContentItem,
            Resource,
            catalog["content_resource_links"],
            all_resource_ids,
            replace_curriculum,
        )
        plan["concept_resource_links"] = self.new_link_count(
            Concept.resources.through,
            Concept,
            Resource,
            catalog["concept_resource_links"],
            all_resource_ids,
            replace_curriculum,
        )
        plan["unresolved_resource_links"] = sum(
            resource_id not in all_resource_ids
            for _, resource_id in catalog["content_resource_links"]
            | catalog["concept_resource_links"]
        )
        return plan

    def new_link_count(
        self,
        through_model,
        left_model,
        right_model,
        pairs,
        resource_ids,
        replacing=False,
    ):
        left_field, right_field = through_fields(through_model, left_model, right_model)
        existing = (
            set()
            if replacing
            else set(
                through_model.objects.values_list(
                    f"{left_field}_id", f"{right_field}_id"
                )
            )
        )
        valid_pairs = {
            pair for pair in pairs if pair[1] in resource_ids
        }
        return len(valid_pairs - existing)

    def report_plan(self, plan, apply, replace_curriculum=False):
        mode = "Apply" if apply else "Dry run"
        if replace_curriculum:
            self.stdout.write(
                f"{mode}: curriculum will be replaced; opportunities and skills are unchanged."
            )
            for label, count in plan["deletions"].items():
                self.stdout.write(f"  existing {label} to delete: {count}")
            self.stdout.write(
                f"  opportunities unchanged: {plan['opportunities_unchanged']}"
            )
            self.stdout.write(f"  skills unchanged: {plan['skills_unchanged']}")
        else:
            self.stdout.write(
                f"{mode}: existing database records are never overwritten."
            )
        for label in (
            "subjects",
            "content",
            "concepts",
            "resources",
            "opportunities",
            "skills",
        ):
            values = plan[label]
            self.stdout.write(
                f"  {label}: {len(values['new'])} to "
                f"{'load' if replace_curriculum and label in {'subjects', 'content', 'concepts', 'resources'} else 'add'}, "
                f"{len(values['preserved'])} existing IDs preserved"
            )
        self.stdout.write(
            f"  content-resource links: {plan['content_resource_links']} to add"
        )
        self.stdout.write(
            f"  concept-resource links: {plan['concept_resource_links']} to add"
        )
        self.stdout.write(
            "  missing opportunity image URLs to fill: "
            f"{len(plan['opportunity_images'])}"
        )
        if plan["unresolved_resource_links"]:
            self.stdout.write(
                self.style.WARNING(
                    f"  unresolved resource references: {plan['unresolved_resource_links']}"
                )
            )

    def apply_catalog(self, catalog, plan):
        subject_rows = []
        for subject_id in plan["subjects"]["new"]:
            data = catalog["subjects"][subject_id]
            grade = str(data["grade"]).removeprefix("Grade ")
            semester = str(data["semester"]).removeprefix("Semester ")
            subject_rows.append(
                Subject(
                    id=subject_id,
                    name=data["name"].strip(),
                    description=data.get("description", ""),
                    grade=int(grade),
                    semester=int(semester),
                    category=category_for_subject(subject_id),
                    icon=data.get("icon", "book-open"),
                    display_order=data.get("order", 0),
                )
            )
        Subject.objects.bulk_create(subject_rows, batch_size=500)

        content_rows = []
        for item_id in plan["content"]["new"]:
            subject_id, data = catalog["content"][item_id]
            content_rows.append(
                ContentItem(
                    id=item_id,
                    subject_id=subject_id,
                    type=data["type"],
                    title=data["title"],
                    description=data.get("description", ""),
                    display_order=data.get("order", 0),
                    show_resource_suggestion=not any(
                        resource_id is False for resource_id in data.get("resources", [])
                    ),
                )
            )
        ContentItem.objects.bulk_create(content_rows, batch_size=500)

        concept_rows = []
        for concept_id in plan["concepts"]["new"]:
            content_id, data = catalog["concepts"][concept_id]
            concept_rows.append(
                Concept(
                    id=concept_id,
                    content_item_id=content_id,
                    title=data["title"],
                    description=data.get("description", ""),
                    display_order=data.get("order", 0),
                )
            )
        Concept.objects.bulk_create(concept_rows, batch_size=500)

        resource_rows = []
        for resource_id in plan["resources"]["new"]:
            data = catalog["resources"][resource_id]
            source = data.get("source") or {}
            classification = data.get("classification") or {}
            raw_url = data.get("url", "")
            link_text = ""
            if isinstance(raw_url, dict):
                link_text = str(raw_url.get("text", "")).strip()
                raw_url = raw_url.get("url", "")
            resource_rows.append(
                Resource(
                    id=resource_id,
                    title=data["title"],
                    type=data["type"],
                    provider=data.get("provider") or "",
                    url=raw_url,
                    link_text=link_text or "",
                    image_url=data.get("imageUrl") or "",
                    youtube_id=data.get("youtubeId") or "",
                    legacy_path=source.get("legacyPath") or "",
                    location=source.get("location") or "",
                    classification=classification.get("status") or "",
                    content_type=classification.get("contentType") or "",
                )
            )
        Resource.objects.bulk_create(resource_rows, batch_size=500)

        opportunity_rows = []
        for data in catalog["opportunities"]:
            if data["id"] not in plan["opportunities"]["new"]:
                continue
            opportunity_rows.append(Opportunity(**data))
        Opportunity.objects.bulk_create(
            opportunity_rows, batch_size=250
        )

        skill_rows = []
        for data in catalog["skills"]:
            if data["id"] not in plan["skills"]["new"]:
                continue
            skill_rows.append(Skill(**data))
        Skill.objects.bulk_create(skill_rows, batch_size=250)

        self.add_relationships(
            ContentItem.resources.through,
            ContentItem,
            Resource,
            catalog["content_resource_links"],
        )
        self.add_relationships(
            Concept.resources.through,
            Concept,
            Resource,
            catalog["concept_resource_links"],
        )

    def fill_missing_opportunity_images(self, plan):
        for opportunity_id, image_url in plan["opportunity_images"].items():
            Opportunity.objects.filter(pk=opportunity_id, image_url="").update(
                image_url=image_url
            )

    def add_relationships(self, through_model, left_model, right_model, pairs):
        left_field, right_field = through_fields(through_model, left_model, right_model)
        left_ids = set(left_model.objects.values_list("id", flat=True))
        right_ids = set(right_model.objects.values_list("id", flat=True))
        existing = set(
            through_model.objects.values_list(
                f"{left_field}_id", f"{right_field}_id"
            )
        )
        rows = [
            through_model(
                **{
                    f"{left_field}_id": left_id,
                    f"{right_field}_id": right_id,
                }
            )
            for left_id, right_id in pairs - existing
            if left_id in left_ids and right_id in right_ids
        ]
        through_model.objects.bulk_create(rows, batch_size=1000)
