from django.utils.text import slugify


def unique_identifier(model, value):
    base = slugify(str(value or "")) or "item"
    max_length = model._meta.pk.max_length
    candidate = base[:max_length].rstrip("-") or "item"
    suffix_number = 2

    while model._default_manager.filter(pk=candidate).exists():
        suffix = f"-{suffix_number}"
        candidate = f"{base[: max_length - len(suffix)].rstrip('-')}{suffix}"
        suffix_number += 1

    return candidate