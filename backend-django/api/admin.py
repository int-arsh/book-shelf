from django.contrib import admin
from .models import User, Book


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["email", "name"]
    ordering = ["email"]


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "user", "status"]
