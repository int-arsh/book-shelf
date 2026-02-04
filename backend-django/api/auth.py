import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()


def generate_token(user_id):
    payload = {
        "id": user_id,
        "exp": datetime.utcnow() + timedelta(days=settings.JWT_EXPIRY_DAYS),
    }
    return jwt.encode(
        payload, settings.JWT_SECRET_KEY, algorithm="HS256"
    )


def get_user_from_request(request):
    auth = request.META.get("HTTP_AUTHORIZATION")
    if not auth or not auth.startswith("Bearer "):
        return None
    token = auth.split(" ")[1]
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=["HS256"]
        )
        user_id = payload.get("id")
        if not user_id:
            return None
        return User.objects.filter(pk=user_id).first()
    except Exception:
        return None
