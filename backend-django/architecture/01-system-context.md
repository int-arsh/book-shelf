## System context

```mermaid
flowchart LR
  subgraph Client["Client"]
    FE["Frontend (React/Vite)"]
  end

  subgraph Backend["Backend (Django + DRF)"]
    DJ["Django app (config + api)"]
    AUTH["JWT helpers\n(api/auth.py)"]
    VIEWS["API views\n(api/views.py)"]
    SER["Serializers\n(api/serializers.py)"]
    ORM["Django ORM"]
  end

  subgraph Data["Data"]
    PG["PostgreSQL\n(User, Book)"]
  end

  EXT["Google Books API"]

  FE -->|"HTTPS: /api/*"| DJ
  DJ --> VIEWS
  VIEWS --> AUTH
  VIEWS --> SER
  SER --> ORM
  ORM --> PG

  VIEWS -->|"HTTPS: /api/googlebooks/search?q=..."| EXT
```

### Key URLs (from `api/urls.py`)

- `POST /api/users/register`
- `POST /api/users/login`
- `GET|POST /api/books`
- `PUT|DELETE /api/books/<pk>`
- `GET /api/googlebooks/search?q=...`

