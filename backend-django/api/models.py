from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, name, email, password=None):
        if not email:
            raise ValueError("Email required")
        if not name:
            raise ValueError("Name required")
        email = self.normalize_email(email).lower()
        name = name.strip().lower()[:20]
        user = self.model(name=name, email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, name, email, password=None):
        user = self.create_user(name=name, email=email, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    name = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    objects = UserManager()

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser


class Book(models.Model):
    STATUS_CHOICES = [
        ("reading", "reading"),
        ("completed", "completed"),
        ("want-to-read", "want-to-read"),
    ]
    title = models.CharField(max_length=500)
    author = models.CharField(max_length=500)
    google_book_id = models.CharField(max_length=100)
    poster_url = models.URLField(
        max_length=500,
        default="https://via.placeholder.com/150x200?text=No+Cover",
        blank=True,
    )
    total_pages = models.PositiveIntegerField(default=0)
    current_page = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, default="")
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="want-to-read"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="books")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["google_book_id", "user"], name="unique_google_book_per_user"
            )
        ]
