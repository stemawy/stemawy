from django.db import models


class Subject(models.Model):
    GRADE_CHOICES = [(10, "Grade 10"), (11, "Grade 11")]
    SEMESTER_CHOICES = [(1, "Semester 1"), (2, "Semester 2")]
    CATEGORY_CHOICES = [
        ("science", "Science & Math"),
        ("languages", "Languages"),
        ("humanities", "Humanities & Society"),
        ("computing", "Computing & Applied")
    ]

    id = models.CharField(max_length=160, primary_key=True)
    name = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    grade = models.PositiveSmallIntegerField(choices=GRADE_CHOICES)
    semester = models.PositiveSmallIntegerField(choices=SEMESTER_CHOICES)
    category = models.CharField(
        max_length=30, choices=CATEGORY_CHOICES, default="humanities"
    )
    icon = models.CharField(max_length=80, default="book-open")
    display_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["grade", "semester", "display_order", "name"]
        constraints = [
            models.UniqueConstraint(
                fields=["name", "grade", "semester"],
                name="unique_subject_per_grade_semester",
            )
        ]

    def __str__(self):
        return f"{self.name} - Grade {self.grade}, Semester {self.semester}"


class ContentItem(models.Model):
    TYPE_CHOICES = [
        ("unit", "Unit"),
        ("qs-bank", "Question Bank"),
        ("revision", "Revision"),
        ("references", "References"),
    ]

    subject = models.ForeignKey(
        Subject, related_name="content", on_delete=models.CASCADE
    )
    id = models.CharField(max_length=200, primary_key=True)
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    title = models.CharField(max_length=240)
    description = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "title"]

    def __str__(self):
        return f"{self.subject.name}: {self.title}"


class Concept(models.Model):
    content_item = models.ForeignKey(
        ContentItem, related_name="concepts", on_delete=models.CASCADE
    )
    id = models.CharField(max_length=240, primary_key=True)
    title = models.CharField(max_length=240)
    description = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "title"]

    def __str__(self):
        return self.title


class Resource(models.Model):
    TYPE_CHOICES = [
        ("video", "Video"),
        ("pdf", "PDF"),
        ("document", "Document"),
        ("slides", "Slides"),
        ("sheet", "Sheet"),
        ("test-bank", "Test Bank"),
    ]

    id = models.CharField(max_length=240, primary_key=True)
    title = models.CharField(max_length=300)
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    provider = models.CharField(max_length=100, blank=True)
    url = models.URLField(max_length=1000)
    youtube_id = models.CharField(max_length=40, blank=True)
    legacy_path = models.CharField(max_length=1000, blank=True)
    location = models.CharField(max_length=300, blank=True)
    classification = models.CharField(max_length=40, blank=True)
    content_type = models.CharField(max_length=40, blank=True)
    content_items = models.ManyToManyField(
        ContentItem, related_name="resources", blank=True
    )
    concepts = models.ManyToManyField(Concept, related_name="resources", blank=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title
