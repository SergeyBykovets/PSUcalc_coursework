from django.shortcuts import render
from .models import CPU, GPU

def main(request):
    cpus = CPU.objects.all()  # Усі процесори з бази
    gpus = GPU.objects.all()  # Усі відеокарти з бази

    context = {
        'cpus': cpus,
        'gpus': gpus,
    }
    return render(request, 'main/main.html', context)

def about(request):
    return render(request, 'main/about.html')

def services(request):
    return render(request, 'main/services.html')


