from .import views
from django.urls import path

urlpatterns = [
    path('', views.main),
    path('about-us', views.about),
    path('services', views.services)
]