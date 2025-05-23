from distutils.sysconfig import get_python_inc

from django.test import TestCase
from ..models import CPU, GPU


class CPUModelTest(TestCase):
    def test_cpu_str_method(self):
        """Checks that method __str__ returns the value of field 'model'"""
        cpu = CPU.objects.create(model='Intel Core i9 15900XE', power_usage=120)
        self.assertEqual(str(cpu), 'Intel Core i9 15900XE')

    def test_cpu_fields_values(self):
        """Checks that instance of CPU has correct fields values."""
        cpu = CPU.objects.create(model='AMD Ryzen AI 777', power_usage=75)
        self.assertEqual(cpu.power_usage, 75)
        self.assertEqual(cpu.model, 'AMD Ryzen AI 777')
        self.assertIsInstance(cpu, CPU)


class GPUModelTest(TestCase):
    def test_gpu_str_method(self):
        """Checks that method __str__ returns the value of field 'model'"""
        gpu = GPU.objects.create(model='NVIDIA GTX 5055', power_usage=320)
        self.assertEqual(str(gpu), 'NVIDIA GTX 5055')

    def test_cpu_fields_values(self):
        """Checks that instance of GPU has correct fields values."""
        gpu = GPU.objects.create(model='NVIDIA GTX 5055', power_usage=320)
        self.assertEqual(gpu.model, 'NVIDIA GTX 5055')
        self.assertEqual(gpu.power_usage, 320)
        self.assertIsInstance(gpu, GPU)