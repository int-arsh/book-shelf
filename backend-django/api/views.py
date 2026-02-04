import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .auth import generate_token, get_user_from_request
from .models import Book
from .serializers import BookSerializer, UserSerializer

User = get_user_model()


@api_view(["POST"])
def register_user(request):
    data = request.data
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    if not name or not email or not password:
        return Response(
            {"message": "Please enter all fields"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    name = (name or "").strip().lower()
    if len(name) < 3:
        return Response(
            {"message": "Username must be at least 3 characters long"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if len(name) > 20:
        return Response(
            {"message": "Username must be less than 20 characters long"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if len(password) < 6:
        return Response(
            {"message": "Password must be at least 6 characters long"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    email = (email or "").strip().lower()
    if User.objects.filter(email=email).exists():
        return Response(
            {"message": "User already exists"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        user = User.objects.create_user(name=name, email=email, password=password)
        return Response(
            {
                "_id": user.id,
                "name": user.name,
                "email": user.email,
                "token": generate_token(user.id),
            },
            status=status.HTTP_201_CREATED,
        )
    except Exception:
        return Response(
            {"message": "Server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")
    user = User.objects.filter(email=email).first()
    if user and user.check_password(password):
        return Response(
            {
                "_id": user.id,
                "name": user.name,
                "email": user.email,
                "token": generate_token(user.id),
            },
        )
    return Response(
        {"message": "Invalid email or password"},
        status=status.HTTP_401_UNAUTHORIZED,
    )


def require_auth(view_func):
    def wrapper(request, *args, **kwargs):
        user = get_user_from_request(request)
        if not user:
            return Response(
                {"message": "Not authorized, no token"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        request.user = user
        return view_func(request, *args, **kwargs)
    return wrapper


@api_view(["GET", "POST"])
@require_auth
def book_list(request):
    if request.method == "GET":
        books = Book.objects.filter(user=request.user)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)
    return add_book(request)


@require_auth
def add_book(request):
    if not request.user or not request.user.id:
        return Response(
            {"message": "Not authorized, please log in"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    data = request.data.copy()
    data["user"] = request.user.id
    title = data.get("title")
    author = data.get("author")
    google_book_id = data.get("googleBookId") or data.get("google_book_id")
    if not title or not author or not google_book_id:
        return Response(
            {"message": "Please include all required fields: title, author, and googleBookId"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        book = Book.objects.create(
            title=title,
            author=author,
            google_book_id=google_book_id,
            poster_url=data.get("posterUrl") or data.get("poster_url") or "https://via.placeholder.com/150x200?text=No+Cover",
            total_pages=data.get("totalPages", data.get("total_pages", 0)) or 0,
            current_page=data.get("currentPage", data.get("current_page", 0)) or 0,
            notes=data.get("notes", ""),
            status=data.get("status", "want-to-read"),
            user=request.user,
        )
        serializer = BookSerializer(book)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception:
        return Response(
            {"message": "Server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["PUT", "DELETE"])
@require_auth
def book_detail(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response(
            {"message": "Book not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    if book.user_id != request.user.id:
        return Response(
            {"message": "Not authorized"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    if request.method == "DELETE":
        book.delete()
        return Response({"message": "Book removed"})
    data = request.data
    if "title" in data:
        book.title = data["title"]
    if "author" in data:
        book.author = data["author"]
    if "posterUrl" in data:
        book.poster_url = data["posterUrl"]
    if "totalPages" in data:
        book.total_pages = data["totalPages"]
    if "currentPage" in data:
        book.current_page = data["currentPage"]
    if "notes" in data:
        book.notes = data["notes"]
    if "status" in data:
        book.status = data["status"]
    book.save()
    serializer = BookSerializer(book)
    return Response(serializer.data)


@api_view(["GET"])
def google_books_search(request):
    q = request.query_params.get("q")
    if not q:
        return Response(
            {"message": "Search query is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    url = f"https://www.googleapis.com/books/v1/volumes?q={requests.utils.quote(q)}&key={settings.GOOGLE_BOOKS_API_KEY}"
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        return Response(r.json())
    except Exception:
        return Response(
            {"message": "Error fetching from external API"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
