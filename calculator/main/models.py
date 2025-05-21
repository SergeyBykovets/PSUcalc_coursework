from django.db import models

class CPU(models.Model):
    """
    A model to represent the CPU.

    Attributes:
    - model: CPU model name (string up to 100 characters).
    - power_usage: Power consumption in watts (integer).
    """

    model = models.CharField(max_length=100)  # CPU model caption
    power_usage = models.IntegerField()       # CPU power in Wats

    def __str__(self):
        """Returns the CPU model name as a string."""
        return self.model

class GPU(models.Model):
    """
    Model to represent the GPU.

    Attributes:
    - model: GPU model name (string up to 100 characters).
    - power_usage: Power consumption in watts (integer).
    """
    model = models.CharField(max_length=100)  # GPU model caption
    power_usage = models.IntegerField()       # GPU power in Wats

    def __str__(self):
        """Returns the GPU model name as a string."""
        return self.model


