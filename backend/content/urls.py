from django.urls import path

from . import views

urlpatterns = [
    path("subjects/", views.subjects, name="subjects"),
    path("subjects/<str:subject_id>/", views.subject_detail, name="subject-detail"),
    path("opportunities/", views.opportunities, name="opportunities"),
]
