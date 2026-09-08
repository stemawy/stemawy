from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("content", "0003_subject_category")]
    operations = [
        migrations.CreateModel(
            name="Opportunity",
            fields=[
                ("id", models.CharField(max_length=160, primary_key=True, serialize=False)),
                ("title", models.CharField(max_length=240)),
                ("ar_title", models.CharField(blank=True, max_length=240)),
                ("description", models.TextField()),
                ("ar_description", models.TextField(blank=True)),
                ("url", models.URLField(max_length=1000)),
                ("category", models.CharField(choices=[("research", "Research"), ("competition", "Competitions"), ("course", "Courses"), ("development", "Development")], max_length=30)),
                ("opportunity_type", models.CharField(choices=[("Research Program", "Research Program"), ("Competition", "Competition"), ("Course", "Course"), ("Development Platform", "Development Platform")], max_length=40)),
                ("provider", models.CharField(blank=True, max_length=160)),
                ("field", models.CharField(blank=True, max_length=160)),
                ("eligibility", models.CharField(blank=True, max_length=240)),
                ("location", models.CharField(blank=True, max_length=160)),
                ("deadline", models.CharField(blank=True, max_length=120)),
                ("featured", models.BooleanField(default=False)),
                ("is_published", models.BooleanField(default=True)),
                ("display_order", models.PositiveIntegerField(default=0)),
            ],
            options={"ordering": ["-featured", "display_order", "title"]},
        ),
    ]
