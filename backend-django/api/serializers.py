from rest_framework import serializers
from .models import User, Book


class UserSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(source="id", read_only=True)

    class Meta:
        model = User
        fields = ["_id", "name", "email"]
        extra_kwargs = {"password": {"write_only": True, "min_length": 6}}

    def validate_name(self, value):
        value = value.strip().lower()
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long")
        if len(value) > 20:
            raise serializers.ValidationError("Username must be less than 20 characters long")
        return value

    def validate_email(self, value):
        return value.strip().lower()


class BookSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(source="id", read_only=True)
    googleBookId = serializers.CharField(source="google_book_id")
    posterUrl = serializers.URLField(source="poster_url", required=False, allow_blank=True)
    totalPages = serializers.IntegerField(source="total_pages", required=False, default=0)
    currentPage = serializers.IntegerField(source="current_page", required=False, default=0)

    class Meta:
        model = Book
        fields = [
            "_id",
            "title",
            "author",
            "googleBookId",
            "posterUrl",
            "totalPages",
            "currentPage",
            "notes",
            "status",
            "user",
        ]
        read_only_fields = ["user"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["user"] = str(instance.user_id)
        data["createdAt"] = instance.created_at.isoformat()
        data["updatedAt"] = instance.updated_at.isoformat()
        return data
