from django.contrib import admin
from .models import CPU, GPU


# Registration of models in Django Admin

@admin.register(CPU)
class CPUAdmin(admin.ModelAdmin):
    """
    Admin panel for CPU model.

    Attributes:
    - list_display: Fields that will be displayed in the object list.
    - search_fields: Searchable fields.
    - list_display_links: Fields that will be clickable to go to the editing page.
    """

    list_display = ('id', 'model', 'power_usage')
    search_fields = ['model', 'power_usage']
    list_display_links = ('id', 'model')


@admin.register(GPU)
class GPUAdmin(admin.ModelAdmin):
    """
    Admin panel for GPU model.

    Attributes:
    - list_display: Fields that will be displayed in the object list.
    - search_fields: Searchable fields.
    - list_display_links: Fields that will be clickable to go to the editing page.
    """
    list_display = ('id', 'model', 'power_usage')
    search_fields = ['model', 'power_usage']
    list_display_links = ('id', 'model')
