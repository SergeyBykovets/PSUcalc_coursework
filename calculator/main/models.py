from django.db import models

class CPU(models.Model):
    model = models.CharField(max_length=100)  # Назва моделі процесора
    power_usage = models.IntegerField()       # Споживана потужність у ватах

    def __str__(self):
        return self.model

class GPU(models.Model):
    model = models.CharField(max_length=100)  # Назва моделі відеокарти
    power_usage = models.IntegerField()       # Споживана потужність у ватах

    def __str__(self):
        return self.model

# Create your models here.
