# Stemawy Django Backend

The Django backend is the editable source of truth for subjects, units, concepts, resources, opportunities, skills, and announcements. The built-in Django admin is available at `/admin/`; the Next.js app reads the catalog from the read-only API and keeps bundled data as an offline fallback.

## Local Setup

From the project root, export the current opportunity and skill catalogs, then initialize the backend:

```powershell
npm run export:admin-seed
python -m pip install -r backend/requirements.txt
Push-Location backend
python manage.py migrate
python manage.py check
python manage.py import_migrated_data
```

The importer command above is preview-only. Review its counts first. To add only missing records while preserving admin edits and existing database-only records:

```powershell
Copy-Item db.sqlite3 "$env:TEMP/stemawy-db-before-import.sqlite3"
python manage.py import_migrated_data --apply
python manage.py createsuperuser
python manage.py runserver 8000
```

Open the admin at `http://127.0.0.1:8000/admin/`. Create your own superuser; no default login is created.

The importer does not delete rows or overwrite matching IDs. It normalizes repeated legacy concept IDs, validates source URLs and model fields, and adds missing resource relationships. It runs inside one database transaction. Do not use old `--clear` instructions or the retired `seed_opportunities` command.

## Admin Organization

- **Subjects**: filter by grade, semester, and publish state; edit units inline.
- **Content items**: manage units, revision, question-bank, and reference entries; subject forms expose units inline.
- **Concepts**: edit concept details inline on content-item forms.
- **Resources**: manage links, provider, type, playlist link text, classification, and curriculum assignments with autocomplete.
- **Opportunities**: manage bilingual descriptions, provider, category, deadline, image, order, featured state, and publishing.
- **Skills**: manage bilingual content, destination, CTA labels, category, type, provider, icon, order, and publishing.
- **Announcements**: manage bilingual titles and messages, optional destination links, and publishing; published announcements appear in the website notification panel.

Catalog list pages are paginated and searchable. The API caches reads briefly and clears its cache after admin changes and completed imports.

## API

- `GET /api/subjects/?grade=10&semester=1`
- `GET /api/subjects/<subject-id>/`
- `GET /api/opportunities/`
- `GET /api/announcements/`
- `GET /api/skills/`
- `GET /api/search/?q=biology&lang=en&limit=4`

The frontend defaults to `http://127.0.0.1:8000/api`. Set `NEXT_PUBLIC_STEMAWY_API_URL` at Next.js build/runtime when hosting the backend elsewhere.

## Environment and Production

See the root `.env.example`. Django reads its settings from process environment variables:

- `DJANGO_DEBUG` defaults to `true` for local development.
- `DJANGO_SECRET_KEY` is required when `DJANGO_DEBUG=false`.
- `DJANGO_ALLOWED_HOSTS` is a comma-separated host list.
- `STEMAWY_CORS_ALLOWED_ORIGINS` is a comma-separated origin allowlist.
- `DJANGO_CACHE_DIR` can set the file-cache directory; default is `backend/.cache/`.

SQLite is suitable for local development and a single modest deployment. Use persistent storage and automated backups for production; take a fresh backup before catalog imports or schema migrations. Never commit the database, production secret, or backup files.

## Validation

```powershell
Push-Location backend
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test content
python manage.py import_migrated_data
Pop-Location
```
