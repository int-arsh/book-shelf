## Request lifecycle (routing → auth → DB)

```mermaid
sequenceDiagram
  autonumber
  participant FE as Frontend
  participant URL as Django URLConf (config/urls.py)
  participant APIURL as API URLConf (api/urls.py)
  participant V as View (api/views.py)
  participant A as require_auth / get_user_from_request (api/views.py + api/auth.py)
  participant S as Serializer (api/serializers.py)
  participant ORM as Django ORM
  participant DB as PostgreSQL

  FE->>URL: HTTP request /api/books (Authorization: Bearer <jwt>)
  URL->>APIURL: include("api.urls")
  APIURL->>V: book_list()
  V->>A: require_auth wrapper
  A->>A: Parse Authorization header
  A->>A: jwt.decode(token, JWT_SECRET_KEY)
  A->>ORM: User.objects.filter(pk=id).first()
  ORM->>DB: SELECT user WHERE id = ...
  DB-->>ORM: user row
  ORM-->>A: User instance / None

  alt authorized
    V->>ORM: Book.objects.filter(user=request.user)
    ORM->>DB: SELECT books WHERE user_id = ...
    DB-->>ORM: rows
    V->>S: BookSerializer(books, many=True)
    S-->>V: JSON payload
    V-->>FE: 200 OK [books...]
  else missing/invalid token
    V-->>FE: 401 Not authorized, no token
  end
```

### Where each step lives

- **Routing**: `config/urls.py` includes `api.urls` at `/api/`
- **Views**: `api/views.py`
- **Auth**: `require_auth()` in `api/views.py` + JWT decode in `api/auth.py`
- **Serialization**: `api/serializers.py`
- **Persistence**: `api/models.py` + Django ORM to PostgreSQL (`config/settings.py`)


