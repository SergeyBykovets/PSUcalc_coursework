from django.contrib import admin
from .models import CPU, GPU
# Register your models here.

@admin.register(CPU)
class CPUAdmin(admin.ModelAdmin):
    list_display = ('id', 'model', 'power_usage' )
    search_fields = ['model', 'power_usage']
    list_display_links = ('id', 'model')

@admin.register(GPU)
class GPUAdmin(admin.ModelAdmin):
    list_display = ('id', 'model', 'power_usage' )
    search_fields = ['model', 'power_usage']
    list_display_links = ('id', 'model')