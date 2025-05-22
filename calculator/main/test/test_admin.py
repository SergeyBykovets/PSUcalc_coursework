from django.test import TestCase
from django.contrib.admin.sites import AdminSite
from ..models import CPU, GPU
from ..admin import CPUAdmin, GPUAdmin


class CPUAdminTest(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.cpu_admin = CPUAdmin(CPU, self.site)

    def test_list_display(self):
        """Checks that list_display contains the required fields"""
        self.assertEqual(self.cpu_admin.list_display, ('id', 'model', 'power_usage'))

    def test_search_fields(self):
        """Checks that search_fields contains the required fields"""
        self.assertEqual(self.cpu_admin.search_fields, ['model', 'power_usage'])

    def test_list_display_links(self):
        """Checks that list_display_links contains the required fields"""
        self.assertEqual(self.cpu_admin.list_display_links, ('id', 'model'))


class GPUAdminTest(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.gpu_admin = GPUAdmin(GPU, self.site)

    def test_list_display(self):
        """Checks that list_display contains the required fields"""
        self.assertEqual(self.gpu_admin.list_display, ('id', 'model', 'power_usage'))

    def test_search_fields(self):
        """Checks that search_fields contains the required fields"""
        self.assertEqual(self.gpu_admin.search_fields, ['model', 'power_usage'])

    def test_list_display_links(self):
        """Checks that list_display_links contains the required fields"""
        self.assertEqual(self.gpu_admin.list_display_links, ('id', 'model'))
