#!/bin/sh
cd "$(dirname "$0")"
. .venv/bin/activate
python manage.py migrate
python manage.py runserver 5000
