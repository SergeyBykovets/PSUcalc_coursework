from django.shortcuts import render
from .models import CPU, GPU


def main(request):
    """
    The main page of the application.

    Gets all CPUs and GPUs from the database
    and passes them to the template 'main/main.html'.

    :param request: HTTP request from the user.

    :return: HTTP response with the rendered main page and the passed context.
    """

    cpus = CPU.objects.all()  # Select all cpu's from db
    gpus = GPU.objects.all()  # Select all gpu's from db

    context = {
        'cpus': cpus,
        'gpus': gpus,
    }
    return render(request, 'main/main.html', context)


def about(request):
    """
    About Us page.

    :param request: HTTP request from the user.
    :return: HTTP response with a rendering of the 'main.about.html' page.
    """

    return render(request, 'main/about.html')


def services(request):
    """
    The Services page.

    :param request: HTTP request from the user.
    :return: HTTP response with a rendering of the 'main.services.html' page.
    """

    return render(request, 'main/services.html')
