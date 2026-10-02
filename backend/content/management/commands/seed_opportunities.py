from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Retired. Use import_migrated_data to preview and add missing catalog records."

    def handle(self, *args, **options):
        raise CommandError(
            "This command was retired because it overwrote administrator edits. "
            "Run 'python manage.py import_migrated_data' for a dry run, then add "
            "--apply to import only missing records."
        )
