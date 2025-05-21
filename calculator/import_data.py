import csv
import os
import django

# Налаштування Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'calculator.settings')
django.setup()

from main.models import CPU, GPU

CPU.objects.all().delete()
GPU.objects.all().delete()

# Імпорт CPU
with open('cpus.csv', newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    cpu_objects = [CPU(model=row['model'], power_usage=int(row['power_usage'])) for row in reader]
    CPU.objects.bulk_create(cpu_objects)

# Імпорт GPU
with open('gpus.csv', newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    gpu_objects = [GPU(model=row['model'], power_usage=int(row['power_usage'])) for row in reader]
    GPU.objects.bulk_create(gpu_objects)

print("Дані успішно імпортовані!")