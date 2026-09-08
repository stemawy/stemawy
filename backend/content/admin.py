from django.contrib import admin

from .models import Concept, ContentItem, Opportunity, Resource, Subject


class ConceptInline(admin.TabularInline):
    model = Concept
    extra = 0
    fields = ("id", "title", "description", "display_order")


class ContentItemInline(admin.StackedInline):
    model = ContentItem
    extra = 0
    fields = ("id", "type", "title", "description", "display_order")
    show_change_link = True


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
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

    @admin.display(description="Units")
    def unit_count(self, obj):
        return obj.content.filter(type="unit").count()


@admin.register(ContentItem)
class ContentItemAdmin(admin.ModelAdmin):
    list_display = ("title", "subject", "type", "display_order")
    list_filter = ("type", "subject__grade", "subject__semester")
    search_fields = ("id", "title", "description", "subject__name")
    ordering = ("subject", "display_order", "title")
    inlines = (ConceptInline,)


@admin.register(Concept)
class ConceptAdmin(admin.ModelAdmin):
    list_display = ("title", "content_item", "display_order")
    search_fields = ("id", "title", "description")
    list_filter = ("content_item__subject__grade", "content_item__type")


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ("title", "type", "provider", "content_type")
    list_filter = ("type", "provider", "content_type")
    search_fields = ("id", "title", "url", "legacy_path")
    filter_horizontal = ("content_items", "concepts")


@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
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

    @admin.display(boolean=True, description="Image")
    def has_image(self, obj):
        return bool(obj.image_url)


admin.site.site_header = "Stemawy Content Administration"
admin.site.site_title = "Stemawy Admin"
admin.site.index_title = "Manage Website Content"
