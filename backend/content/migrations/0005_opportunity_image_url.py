from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("content", "0004_opportunity")]

    operations = [
        migrations.AddField(
            model_name="opportunity",
            name="image_url",
            field=models.URLField(blank=True, max_length=1000),
        ),
    ]
