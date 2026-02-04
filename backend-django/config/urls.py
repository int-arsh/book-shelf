from django.http import HttpResponse
from django.urls import path, include

urlpatterns = [
    path("", lambda r: HttpResponse("Hello from Backend!")),
    path("api/", include("api.urls")),
]
