from django.db import models

from .ids import unique_identifier


class Subject(models.Model):
    GRADE_CHOICES = [(10, "Grade 10"), (11, "Grade 11")]
    SEMESTER_CHOICES = [(1, "Semester 1"), (2, "Semester 2")]
    CATEGORY_CHOICES = [
        ("science", "Science & Math"),
        ("languages", "Languages"),
        ("computing", "Computing & Applied"),
        ("humanities", "Humanities & Society"),
    ]
    ICON_CHOICES = [
        ("physics", "Physics"),
        ("chemistry", "Chemistry"),
        ("biology", "Biology"),
        ("geology", "Geology"),
        ("maths", "Mathematics"),
        ("mechanics", "Mechanics"),
        ("arabic", "Arabic"),
        ("english", "English"),
        ("german", "German"),
        ("french", "French"),
        ("computer-science", "Computer Science"),
        ("computerscience", "Computer Science (existing records)"),
        ("religion", "Religion"),
        ("social-studies", "Social Studies"),
        ("socialstudies", "Social Studies (existing records)"),
        ("civics", "Civics"),
        ("citizenship", "Citizenship"),
        ("capstone", "Capstone"),
        ("book-open", "Book"),
        ("atom", "Atom"),
        ("flask", "Flask"),
        ("leaf", "Leaf"),
        ("globe", "Globe"),
        ("calculator", "Calculator"),
        ("gauge", "Gauge"),
        ("languages", "Languages"),
        ("code", "Code"),
        ("landmark", "Landmark"),
        ("history", "History"),
        ("lightbulb", "Lightbulb"),
    ]

    id = models.CharField(max_length=160, primary_key=True, blank=True, default="")
    name = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    grade = models.PositiveSmallIntegerField(choices=GRADE_CHOICES)
    semester = models.PositiveSmallIntegerField(choices=SEMESTER_CHOICES)
    category = models.CharField(
        max_length=30, choices=CATEGORY_CHOICES, default="humanities"
    )
    icon = models.CharField(max_length=80, choices=ICON_CHOICES, default="book-open")
    display_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["grade", "semester", "display_order", "name"]
        indexes = [models.Index(fields=["grade", "semester", "is_published"])]
        constraints = [
            models.UniqueConstraint(
                fields=["name", "grade", "semester"],
                name="unique_subject_per_grade_semester",
            )
        ]

    def __str__(self):
        return f"{self.name} - Grade {self.grade}, Semester {self.semester}"

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = unique_identifier(
                type(self), f"{self.name}-g{self.grade}-s{self.semester}"
            )
        super().save(*args, **kwargs)


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
    id = models.CharField(max_length=200, primary_key=True, blank=True, default="")
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    title = models.CharField(max_length=240)
    description = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0)
    show_resource_suggestion = models.BooleanField(default=True)

    class Meta:
        ordering = ["display_order", "title"]

    def __str__(self):
        return f"{self.subject.name}: {self.title}"

    def save(self, *args, **kwargs):
        if not self.id:
            sequence = self.display_order or 1
            self.id = unique_identifier(
                type(self),
                f"{self.subject_id}-{self.type}-{sequence:02d}-{self.title}",
            )
        super().save(*args, **kwargs)


class Concept(models.Model):
    content_item = models.ForeignKey(
        ContentItem, related_name="concepts", on_delete=models.CASCADE
    )
    id = models.CharField(max_length=240, primary_key=True, blank=True, default="")
    title = models.CharField(max_length=240)
    description = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "title"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = unique_identifier(
                type(self), f"{self.content_item_id}-concept-{self.title}"
            )
        super().save(*args, **kwargs)


class Resource(models.Model):
    TYPE_CHOICES = [
        ("video", "Video"),
        ("pdf", "PDF"),
        ("document", "Document"),
        ("slides", "Slides"),
        ("sheet", "Sheet"),
        ("test-bank", "Test Bank"),
        ("file", "File"),
        ("image", "Image"),
    ]

    id = models.CharField(max_length=240, primary_key=True, blank=True, default="")
    title = models.CharField(max_length=300)
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    provider = models.CharField(max_length=100, blank=True)
    url = models.URLField(max_length=1000)
    link_text = models.CharField(max_length=240, blank=True)
    image_url = models.URLField(max_length=1000, blank=True)
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

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = unique_identifier(type(self), f"resource-{self.title}")
        super().save(*args, **kwargs)


class Opportunity(models.Model):
    CATEGORY_CHOICES = [
        ("research", "Research"),
        ("competition", "Competitions"),
        ("course", "Courses"),
        ("development", "Development"),
    ]
    TYPE_CHOICES = [
        ("Research Program", "Research Program"),
        ("Competition", "Competition"),
        ("Course", "Course"),
        ("Development Platform", "Development Platform"),
    ]

    id = models.CharField(max_length=160, primary_key=True, blank=True, default="")
    title = models.CharField(max_length=240)
    ar_title = models.CharField(max_length=240, blank=True)
    description = models.TextField()
    ar_description = models.TextField(blank=True)
    url = models.URLField(max_length=1000)
    image_url = models.URLField(max_length=1000, blank=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    opportunity_type = models.CharField(max_length=40, choices=TYPE_CHOICES)
    provider = models.CharField(max_length=160, blank=True)
    field = models.CharField(max_length=160, blank=True)
    eligibility = models.CharField(max_length=240, blank=True)
    location = models.CharField(max_length=160, blank=True)
    deadline = models.CharField(max_length=120, blank=True)
    featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-featured", "display_order", "title"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = unique_identifier(type(self), f"opportunity-{self.title}")
        super().save(*args, **kwargs)


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ("english", "English"),
        ("programming", "Programming"),
        ("study-learning", "Study & Learning"),
        ("mathematics", "Mathematics"),
        ("science", "Science"),
        ("productivity", "Productivity"),
        ("tools-utility", "Tools & Utility"),
    ]
    TYPE_CHOICES = [
        ("assessment", "Assessment"),
        ("practice", "Practice"),
        ("learning-resource", "Learning Resource"),
        ("tool", "Tool"),
    ]
    ICON_CHOICES = [
        ("speed", "Speed"),
        ("keyboard", "Keyboard"),
        ("quiz", "Quiz"),
        ("smart_toy", "Smart Toy"),
        ("spellcheck", "Spellcheck"),
        ("rule", "Rule"),
        ("menu_book", "Menu Book"),
        ("edit_note", "Edit Note"),
        ("headphones", "Headphones"),
        ("record_voice_over", "Record Voice Over"),
        ("translate", "Translate"),
        ("calculate", "Calculate"),
        ("science", "Science"),
        ("explore", "Explore"),
        ("code", "Code"),
        ("psychology", "Psychology"),
        ("school", "School"),
    ]

    id = models.SlugField(max_length=160, primary_key=True, blank=True, default="")
    title = models.CharField(max_length=240)
    ar_title = models.CharField(max_length=240, blank=True)
    description = models.TextField(blank=True)
    ar_description = models.TextField(blank=True)
    url = models.URLField(max_length=1000)
    action = models.CharField(max_length=120, blank=True)
    ar_action = models.CharField(max_length=120, blank=True)
    category = models.CharField(max_length=40, choices=CATEGORY_CHOICES)
    skill_type = models.CharField(max_length=40, choices=TYPE_CHOICES)
    provider = models.CharField(max_length=160, blank=True)
    icon = models.CharField(max_length=80, choices=ICON_CHOICES, default="school")
    is_published = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "title"]
        indexes = [models.Index(fields=["category", "is_published", "display_order"])]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = unique_identifier(type(self), f"skill-{self.title}")
        super().save(*args, **kwargs)


class Announcement(models.Model):
    title = models.CharField(max_length=240)
    ar_title = models.CharField(max_length=240, blank=True)
    message = models.TextField()
    ar_message = models.TextField(blank=True)
    link_url = models.URLField(max_length=1000, blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "title"]

    def __str__(self):
        return self.title
