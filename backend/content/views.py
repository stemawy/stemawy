import re
import unicodedata

from django.http import JsonResponse
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.views.decorators.cache import cache_page
from django.views.decorators.http import require_GET

from .models import Announcement, ContentItem, Opportunity, Resource, Skill, Subject

CACHE_SECONDS = 60


def announcement_payload(announcement):
    return {
        "id": announcement.pk,
        "title": announcement.title,
        "arTitle": announcement.ar_title or announcement.title,
        "message": announcement.message,
        "arMessage": announcement.ar_message or announcement.message,
        "href": announcement.link_url,
        "createdAt": announcement.created_at.isoformat(),
    }


@require_GET
@cache_page(CACHE_SECONDS)
def announcements(request):
    queryset = Announcement.objects.filter(is_published=True)
    return JsonResponse({"announcements": [announcement_payload(item) for item in queryset]})


def resource_payload(resource):
    return {
        "id": resource.id,
        "title": resource.title,
        "type": resource.type,
        "provider": resource.provider,
        "url": resource.url,
        "linkText": resource.link_text,
        "youtubeId": resource.youtube_id,
        "source": {
            "legacyPath": resource.legacy_path,
            "location": resource.location,
        },
        "classification": {
            "status": resource.classification or "unclassified",
            "contentType": resource.content_type or None,
        },
    }


def concept_payload(concept):
    return {
        "id": concept.id,
        "title": concept.title,
        "description": concept.description,
        "resources": [resource.id for resource in concept.resources.all()],
    }


def content_payload(item):
    return {
        "id": item.id,
        "type": item.type,
        "number": str(item.display_order).zfill(2) if item.type == "unit" else None,
        "title": item.title,
        "description": item.description,
        "order": item.display_order,
        "concepts": [concept_payload(concept) for concept in item.concepts.all()],
        "resources": [resource.id for resource in item.resources.all()],
    }


def subject_payload(subject):
    content = list(subject.content.all())
    resources = {}
    for item in content:
        for resource in item.resources.all():
            resources[resource.id] = resource
        for concept in item.concepts.all():
            for resource in concept.resources.all():
                resources[resource.id] = resource

    return {
        "id": subject.id,
        "name": subject.name,
        "description": subject.description,
        "grade": f"Grade {subject.grade}",
        "semester": f"Semester {subject.semester}",
        "category": subject.category,
        "icon": subject.icon,
        "content": [content_payload(item) for item in content],
        "units": sum(item.type == "unit" for item in content),
        "resources": [resource_payload(resource) for resource in resources.values()],
    }


def subject_queryset():
    return Subject.objects.filter(is_published=True).prefetch_related(
        "content__resources",
        "content__concepts__resources",
    )


@require_GET
@cache_page(CACHE_SECONDS)
def subjects(request):
    queryset = subject_queryset()
    grade = request.GET.get("grade")
    semester = request.GET.get("semester")
    if grade in {"10", "11"}:
        queryset = queryset.filter(grade=int(grade))
    if semester in {"1", "2"}:
        queryset = queryset.filter(semester=int(semester))

    return JsonResponse({"subjects": [subject_payload(item) for item in queryset]})


@require_GET
@cache_page(CACHE_SECONDS)
def subject_detail(request, subject_id):
    subject = get_object_or_404(subject_queryset(), id=subject_id)
    return JsonResponse(subject_payload(subject))


def opportunity_payload(opportunity):
    return {
        "id": opportunity.id,
        "title": opportunity.title,
        "arTitle": opportunity.ar_title or opportunity.title,
        "description": opportunity.description,
        "arDescription": opportunity.ar_description or opportunity.description,
        "href": opportunity.url,
        "imageUrl": opportunity.image_url,
        "bannerImage": opportunity.image_url,
        "category": opportunity.category,
        "type": opportunity.opportunity_type,
        "provider": opportunity.provider,
        "field": opportunity.field,
        "eligibility": opportunity.eligibility,
        "location": opportunity.location,
        "deadline": opportunity.deadline,
        "featured": opportunity.featured,
        "image": opportunity.image_url,
        "urgent": False,
        "date": opportunity.deadline,
    }


@require_GET
@cache_page(CACHE_SECONDS)
def opportunities(request):
    queryset = Opportunity.objects.filter(is_published=True)
    return JsonResponse({"opportunities": [opportunity_payload(item) for item in queryset]})


def skill_payload(skill):
    return {
        "id": skill.id,
        "title": skill.title,
        "arTitle": skill.ar_title or skill.title,
        "description": skill.description,
        "arDescription": skill.ar_description or skill.description,
        "href": skill.url,
        "action": skill.action,
        "arAction": skill.ar_action or skill.action,
        "category": skill.category,
        "type": skill.skill_type,
        "provider": skill.provider,
        "icon": skill.icon,
    }


@require_GET
@cache_page(CACHE_SECONDS)
def skills(request):
    queryset = Skill.objects.filter(is_published=True)
    return JsonResponse({"skills": [skill_payload(item) for item in queryset]})


def normalize_search_text(value):
    value = unicodedata.normalize("NFD", value.lower())
    value = "".join(
        character
        for character in value
        if unicodedata.category(character) != "Mn"
    )
    value = re.sub(r"[\u064b-\u065f\u0670\u0640]", "", value)
    value = re.sub("[أإآ]", "ا", value).replace("ى", "ي")
    return re.sub(r"[^a-z0-9\u0600-\u06ff]+", " ", value).strip()


def search_filter(fields, terms):
    query = Q()
    for term in terms:
        term_query = Q()
        for field in fields:
            term_query |= Q(**{f"{field}__icontains": term})
        query &= term_query
    return query


def search_score(query, title, searchable):
    normalized_title = normalize_search_text(title)
    normalized_searchable = normalize_search_text(f"{title} {searchable}")
    if normalized_title == query:
        return 1000
    if normalized_title.startswith(query):
        return 900
    if query in normalized_title:
        return 800
    if query in normalized_searchable:
        return 700
    terms = query.split()
    matched = sum(term in normalized_searchable for term in terms)
    return 600 + matched if matched == len(terms) else 0


def make_search_group(group_type, query, candidates, limit):
    matches = []
    for candidate in candidates:
        score = search_score(query, candidate["title"], candidate["searchable"])
        if score:
            matches.append((score, candidate["result"]))
    matches.sort(key=lambda item: (-item[0], item[1]["title"].casefold()))
    if not matches:
        return None
    return {
        "type": group_type,
        "count": len(matches),
        "results": [result for _, result in matches[:limit]],
    }


@require_GET
@cache_page(CACHE_SECONDS)
def search(request):
    raw_query = request.GET.get("q", "")[:120]
    normalized_query = normalize_search_text(raw_query)
    if len(normalized_query) < 2:
        return JsonResponse({"total": 0, "groups": []})

    terms = normalized_query.split()
    language = "ar" if request.GET.get("lang") == "ar" else "en"
    try:
        limit = min(250, max(1, int(request.GET.get("limit", 4))))
    except ValueError:
        limit = 4

    opportunity_fields = (
        "title",
        "ar_title",
        "description",
        "ar_description",
        "provider",
        "category",
        "opportunity_type",
        "field",
        "location",
        "eligibility",
    )
    opportunities = Opportunity.objects.filter(is_published=True).filter(
        search_filter(opportunity_fields, terms)
    )
    opportunity_candidates = []
    for item in opportunities:
        title = (item.ar_title or item.title) if language == "ar" else item.title
        description = (
            (item.ar_description or item.description)
            if language == "ar"
            else item.description
        )
        opportunity_candidates.append(
            {
                "title": title,
                "searchable": " ".join(str(getattr(item, field) or "") for field in opportunity_fields),
                "result": {
                    "id": item.id,
                    "type": "opportunity",
                    "title": title,
                    "description": description,
                    "detail": f"{item.provider} · {item.opportunity_type}",
                    "href": item.url,
                    "external": True,
                },
            }
        )

    skill_fields = (
        "title",
        "ar_title",
        "description",
        "ar_description",
        "provider",
        "category",
        "skill_type",
    )
    skill_candidates = []
    for item in Skill.objects.filter(is_published=True).filter(
        search_filter(skill_fields, terms)
    ):
        title = (item.ar_title or item.title) if language == "ar" else item.title
        description = (
            (item.ar_description or item.description)
            if language == "ar"
            else item.description
        )
        skill_candidates.append(
            {
                "title": title,
                "searchable": " ".join(str(getattr(item, field) or "") for field in skill_fields),
                "result": {
                    "id": item.id,
                    "type": "skill",
                    "title": title,
                    "description": description,
                    "detail": f"{item.provider} · {item.category.replace('-', ' ')}",
                    "href": item.url,
                    "external": True,
                },
            }
        )

    subject_fields = ("name", "description", "grade", "semester", "category")
    subject_candidates = []
    for subject in subject_queryset().filter(search_filter(subject_fields, terms)):
        detail = f"Grade {subject.grade} · Semester {subject.semester}"
        searchable = " ".join(str(getattr(subject, field) or "") for field in subject_fields)
        subject_candidates.append(
            {
                "title": subject.name,
                "searchable": searchable,
                "result": {
                    "id": subject.id,
                    "type": "subject",
                    "title": subject.name,
                    "description": subject.description,
                    "detail": detail,
                    "href": f"/subject/{subject.id}",
                    "external": False,
                },
            }
        )

    unit_candidates = []
    unit_query = search_filter(
        (
            "title",
            "description",
            "subject__name",
            "subject__description",
            "subject__grade",
            "subject__semester",
            "concepts__title",
            "concepts__description",
        ),
        terms,
    )
    units = (
        ContentItem.objects.filter(
            type="unit",
            subject__is_published=True,
        )
        .filter(unit_query)
        .select_related("subject")
        .prefetch_related("concepts")
        .distinct()
    )
    for item in units:
        subject = item.subject
        detail = f"Grade {subject.grade} · Semester {subject.semester}"
        concept_text = " ".join(
            f"{concept.title} {concept.description}"
            for concept in item.concepts.all()
        )
        searchable = (
            f"{item.title} {item.description} {subject.name} "
            f"{subject.description} {detail} {concept_text}"
        )
        unit_candidates.append(
            {
                "title": item.title,
                "searchable": searchable,
                "result": {
                    "id": item.id,
                    "type": "unit",
                    "title": item.title,
                    "description": item.description,
                    "detail": f"{subject.name} · {detail}",
                    "href": f"/subject/{subject.id}?unit={item.id}",
                    "external": False,
                },
            }
        )

    groups = [
        make_search_group("opportunity", normalized_query, opportunity_candidates, limit),
        make_search_group("skill", normalized_query, skill_candidates, limit),
        make_search_group("subject", normalized_query, subject_candidates, limit),
        make_search_group("unit", normalized_query, unit_candidates, limit),
    ]
    groups = [group for group in groups if group]
    return JsonResponse(
        {"total": sum(group["count"] for group in groups), "groups": groups}
    )
