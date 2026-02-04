## Backend Django architecture

This folder contains **Mermaid diagrams** describing how the Django backend is structured and how requests flow through the system.

### Diagrams

- `01-system-context.md`: System/context view (Frontend ↔ Django ↔ Postgres, Google Books API)
- `02-request-lifecycle.md`: Request lifecycle for core endpoints (routing → auth → serializers → ORM)
- `03-auth-jwt.md`: JWT auth (register/login + authenticated request)
- `04-data-model.md`: Data model (ER diagram for `User` and `Book`)
- `05-deployment.md`: Deployment/runtime view (env vars, Django app, database, external API)

### Notes

- Routes come from `config/urls.py` and `api/urls.py`.
- Core views are in `api/views.py` and JWT helpers in `api/auth.py`.


