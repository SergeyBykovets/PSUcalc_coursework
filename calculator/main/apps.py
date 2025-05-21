from django.apps import AppConfig


class MainConfig(AppConfig):
    """
    Configuration of the 'main' application.

    Attributes:
    - default_auto_field: Type of the automatic field for the primary key.
    - name: Name of the project registered in Django.
    """

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'
