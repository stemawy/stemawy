from django.contrib import admin
from django.db.models import Count, Q

from .models import Announcement, Concept, ContentItem, Opportunity, Resource, Skill, Subject


class GeneratedIdAdmin(admin.ModelAdmin):
    def get_readonly_fields(self, request, obj=None):
        fields = tuple(super().get_readonly_fields(request, obj))
        if obj is not None and "id" not in fields:
            return (*fields, "id")
        return fields

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        if obj is not None:
            return fieldsets

        add_fieldsets = []
        for name, options in fieldsets:
            options = options.copy()
            fields = options.get("fields", ())
            options["fields"] = tuple(field for field in fields if field != "id")
            add_fieldsets.append((name, options))
        return add_fieldsets


class ConceptInline(admin.TabularInline):
    model = Concept
    extra = 0
    fields = ("title", "description", "display_order")


class ContentItemInline(admin.StackedInline):
    model = ContentItem
    extra = 0
    fields = ("type", "title", "description", "display_order")
    show_change_link = True


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ("title", "is_published", "created_at")
    list_filter = ("is_published",)
    search_fields = ("title", "ar_title", "message", "ar_message")
    list_editable = ("is_published",)
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)
    fieldsets = (
        ("English", {"fields": ("title", "message")} ),
        ("Arabic", {"fields": ("ar_title", "ar_message")} ),
        ("Publishing", {"fields": ("link_url", "is_published", "created_at")} ),
    )


@admin.register(Subject)
class SubjectAdmin(GeneratedIdAdmin):
    list_display = (
        "name",
        "grade",
        "semester",
        "display_order",
        "is_published",
        "unit_count",
    )
    list_filter = ("grade", "semester", "is_published")
    search_fields = ("id", "name", "description")
    ordering = ("grade", "semester", "display_order", "name")
    inlines = (ContentItemInline,)
    list_per_page = 50

    @admin.display(description="Units")
    def unit_count(self, obj):
        return obj.unit_count_value

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            unit_count_value=Count(
                "content",
                filter=Q(content__type="unit"),
            )
        )


@admin.register(ContentItem)
class ContentItemAdmin(GeneratedIdAdmin):
    list_display = ("title", "subject", "type", "display_order")
    list_filter = ("type", "subject__grade", "subject__semester")
    search_fields = ("id", "title", "description", "subject__name")
    ordering = ("subject", "display_order", "title")
    inlines = (ConceptInline,)
    autocomplete_fields = ("subject",)
    list_per_page = 50

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("subject")


@admin.register(Concept)
class ConceptAdmin(GeneratedIdAdmin):
    list_display = ("title", "content_item", "display_order")
    search_fields = ("id", "title", "description")
    list_filter = ("content_item__subject__grade", "content_item__type")
    autocomplete_fields = ("content_item",)
    list_per_page = 50

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            "content_item",
            "content_item__subject",
        )


@admin.register(Resource)
class ResourceAdmin(GeneratedIdAdmin):
    list_display = ("title", "type", "provider", "link_text", "content_type")
    list_filter = ("type", "content_type")
    search_fields = ("id", "title", "url", "link_text", "legacy_path")
    autocomplete_fields = ("content_items", "concepts")
    list_per_page = 50
    fieldsets = (
        ("Resource", {"fields": ("id", "title", "type", "provider")} ),
        ("Link", {"fields": ("url", "link_text", "image_url", "youtube_id")} ),
        ("Curriculum", {"fields": ("content_items", "concepts")} ),
        ("Source details", {"fields": ("legacy_path", "location", "classification", "content_type")} ),
    )


@admin.register(Opportunity)
class OpportunityAdmin(GeneratedIdAdmin):
    list_display = ("title", "category", "opportunity_type", "provider", "has_image", "featured", "is_published")
    list_filter = ("category", "opportunity_type", "featured", "is_published")
    search_fields = ("id", "title", "ar_title", "description", "provider", "field", "location")
    list_editable = ("featured", "is_published")
    ordering = ("-featured", "display_order", "title")
    fieldsets = (
        (None, {"fields": ("id", "title", "ar_title", "description", "ar_description", "url", "image_url")}),
        ("Classification", {"fields": ("category", "opportunity_type", "provider", "field", "eligibility", "location", "deadline")}),
        ("Publishing", {"fields": ("featured", "is_published", "display_order")}),
    )
    list_per_page = 50

    @admin.display(boolean=True, description="Image")
    def has_image(self, obj):
        return bool(obj.image_url)


@admin.register(Skill)
class SkillAdmin(GeneratedIdAdmin):
    list_display = (
        "title",
        "category",
        "skill_type",
        "provider",
        "is_published",
        "display_order",
    )
    list_filter = ("category", "skill_type", "is_published")
    search_fields = (
        "id",
        "title",
        "ar_title",
        "description",
        "ar_description",
        "provider",
    )
    list_editable = ("is_published", "display_order")
    ordering = ("display_order", "title")
    list_per_page = 50
    fieldsets = (
        ("Content", {"fields": ("id", "title", "ar_title", "description", "ar_description")} ),
        ("Action", {"fields": ("url", "action", "ar_action", "provider", "icon")} ),
        ("Classification", {"fields": ("category", "skill_type")} ),
        ("Publishing", {"fields": ("is_published", "display_order")} ),
    )


admin.site.site_header = "Stemawy Content Administration"
admin.site.site_title = "Stemawy Admin"
admin.site.index_title = "Manage Website Content"
