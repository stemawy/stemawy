from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from .models import Opportunity, Resource, Subject


def resource_payload(resource):
    return {
        "id": resource.id,
        "title": resource.title,
        "type": resource.type,
        "provider": resource.provider,
        "url": resource.url,
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
        "resources": [
            resource_payload(resource)
            for resource in Resource.objects.filter(
                content_items__subject=subject
            ).distinct()
        ],
    }


def subjects(request):
    queryset = Subject.objects.filter(is_published=True)
    if request.GET.get("grade"):
        queryset = queryset.filter(grade=request.GET["grade"])
    if request.GET.get("semester"):
        queryset = queryset.filter(semester=request.GET["semester"])

    return JsonResponse({"subjects": [subject_payload(item) for item in queryset]})


def subject_detail(request, subject_id):
    subject = get_object_or_404(Subject, id=subject_id, is_published=True)
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


def opportunities(request):
    queryset = Opportunity.objects.filter(is_published=True)
    return JsonResponse({"opportunities": [opportunity_payload(item) for item in queryset]})
