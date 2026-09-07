# Stemawy Django Backend

This backend owns editable curriculum data and exposes the Django admin plus a small read API for the Next.js frontend.

## Setup

From `stemawy/backend`:

```powershell
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py import_migrated_data --clear
python manage.py createsuperuser
python manage.py runserver 8000
```

Admin: `http://127.0.0.1:8000/admin/`

API: `http://127.0.0.1:8000/api/subjects/?grade=10&semester=1`

The importer reads the existing files under `data/generated/migrated`. Run it again with `--clear` when the generated source data should replace the database contents. After that, use the admin to add, edit, publish, reorder, or remove content manually.

The Next.js app uses the Django API when it is available and falls back to the bundled catalog when the backend is offline. Set `NEXT_PUBLIC_STEMAWY_API_URL` if the API is hosted somewhere other than `http://127.0.0.1:8000/api`.
