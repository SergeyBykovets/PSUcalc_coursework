from .import views
from django.urls import path

urlpatterns = [
    path('', views.main, name='home'), # Main page
    path('about-us', views.about, name='about'), # WebPage "About us"
    path('services', views.services, name='services'), # WebPage "Services"
]