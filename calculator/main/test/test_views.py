from http.client import responses

from django.test import TestCase, SimpleTestCase
from .. import views
from ..models import CPU, GPU


class TestHomePage(TestCase):

    def setUp(self):
        CPU.objects.create(model='Intel Core Ultra 9', power_usage=110)
        GPU.objects.create(model='NVIDIA RTX 5050', power_usage=320)

    def test_main_used_correct_templates(self):
        """Checks that for url '/' used template 'main/main.html'"""
        response = self.client.get('/')
        self.assertTemplateUsed(response, 'main/main.html')

    def test_main_context(self):
        """Checks that context in url '/' contains field and get method returns status_code 200"""
        response = self.client.get('/')
        self.assertContains(response, 'Intel Core Ultra 9', status_code=200)
        self.assertContains(response, 'NVIDIA RTX 5050', status_code=200)
        self.assertNotContains(response, 'NVIDIA GPU', status_code=200)
        self.assertContains(response, 'Overclock', status_code=200)
        self.assertContains(response, 'Choose Your Components', status_code=200)


class TestAboutPage(SimpleTestCase):

    def test_about_page_correct_template_used(self):
        """Checks that for url '/about.html' used template 'main/about.html'"""
        response = self.client.get('/about-us')
        self.assertTemplateUsed(response, 'main/about.html')

    def test_about_page_context(self):
        """Checks that context in url '/about' contains the text and get method returns status_code 200"""
        response = self.client.get('/about-us')
        self.assertNotContains(response, 'Intel Core Ultra 9', status_code=200)
        self.assertContains(response, 'This is a website for calculating the power supply',
                            status_code=200)
        self.assertContains(response, 'Our goal is to make the process', status_code=200)
        self.assertContains(response, 'Developer', status_code=200)
        self.assertContains(response, 'a consultation? Write to us!')


class TestServicesPage(SimpleTestCase):
    def test_services_page_correct_template_used(self):
        """Checks that for url '/services.html' used template 'main/services.html'"""
        response = self.client.get('/services')
        self.assertTemplateUsed(response, 'main/services.html')

    def test_services_page_context(self):
        """Checks that context in url '/services' contains the text and get method returns status_code 200"""
        response = self.client.get('/services')
        self.assertNotContains(response, 'Intel Core Ultra 9', status_code=200)
        self.assertContains(response, 'What We Offer', status_code=200)
        self.assertContains(response, 'Power Supply Wattage Calculation', status_code=200)
        self.assertContains(response, 'Useful Resources')
        self.assertContains(response, 'UserBenchmark')
        self.assertNotContains(response, 'NVIDIA RTX 5050')
        self.assertNotContains(response, 'UserSubBenchmark')
