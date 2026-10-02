from django.core.cache import cache
from django.db.models.signals import m2m_changed, post_delete, post_save

from .models import Announcement, Concept, ContentItem, Opportunity, Resource, Skill, Subject


def invalidate_catalog_cache(sender, **kwargs):
    cache.clear()


for model in (Announcement, Subject, ContentItem, Concept, Resource, Opportunity, Skill):
    post_save.connect(
        invalidate_catalog_cache,
        sender=model,
        dispatch_uid=f"content.invalidate_cache.save.{model.__name__}",
    )
    post_delete.connect(
        invalidate_catalog_cache,
        sender=model,
        dispatch_uid=f"content.invalidate_cache.delete.{model.__name__}",
    )

for through_model in (ContentItem.resources.through, Concept.resources.through):
    m2m_changed.connect(
        invalidate_catalog_cache,
        sender=through_model,
        dispatch_uid=f"content.invalidate_cache.m2m.{through_model.__name__}",
    )