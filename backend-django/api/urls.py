from django.urls import path
from . import views

urlpatterns = [
    path("books", views.book_list),
    path("books/", views.book_list),
    path("books/<int:pk>", views.book_detail),
    path("books/<int:pk>/", views.book_detail),
    path("users/register", views.register_user),
    path("users/register/", views.register_user),
    path("users/login", views.login_user),
    path("users/login/", views.login_user),
    path("googlebooks/search", views.google_books_search),
    path("googlebooks/search/", views.google_books_search),
]
