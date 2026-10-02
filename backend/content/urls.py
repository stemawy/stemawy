from django.urls import path

from . import views

urlpatterns = [
    path("announcements/", views.announcements, name="announcements"),
    path("subjects/", views.subjects, name="subjects"),
    path("subjects/<str:subject_id>/", views.subject_detail, name="subject-detail"),
    path("opportunities/", views.opportunities, name="opportunities"),
    path("skills/", views.skills, name="skills"),
    path("search/", views.search, name="search"),
]
