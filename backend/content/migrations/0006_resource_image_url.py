from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("content", "0005_opportunity_image_url")]

    operations = [
        migrations.AddField(
            model_name="resource",
            name="image_url",
            field=models.URLField(blank=True, max_length=1000),
        ),
    ]
