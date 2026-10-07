# Public Deployment

This setup uses **two Vercel projects** and **Neon PostgreSQL**:

- The existing Vercel project hosts the Next.js website.
- A second Vercel project, with its root directory set to `backend`, hosts Django as Python Functions. No Render account or card is needed.
- Neon Free provides the external PostgreSQL database.

This is a free-tier deployment for a non-commercial project, not a production availability guarantee. Vercel Hobby is limited to personal, non-commercial use; confirm your project qualifies under Vercel's terms.

## 1. Push the Latest Backend Setup

Commit and push the latest files (`backend/config/settings.py`, `backend/build.py`, `backend/.python-version`, `backend/requirements.txt`, and this guide) to the GitHub repository connected to Vercel. Do not stage unrelated deleted design files.

## 2. Create the Database

1. Create a Neon project on the Free plan. Vercel Functions default to Washington, D.C. (`iad1`), so choose Neon's AWS US East 1 (N. Virginia) region when available to keep the database close to the Django functions. The earlier Oregon suggestion was for Render and no longer applies.
2. In Neon, open **Connect** and copy the pooled PostgreSQL connection string suitable for serverless functions. Keep the supplied TLS option such as `sslmode=require`.
3. Keep the connection string private; it contains your database password.

Neon Free currently includes 1 GB of database storage, 100 compute-hours per project each month, and 5 GB of monthly public network transfer. Compute suspends after five idle minutes and resumes when queried. Free Neon has no scheduled backups; export important data regularly. Check current limits before deployment because providers can change their plans.

## 3. Create the Django Vercel Project

1. In Vercel, choose **Add New → Project** and import the same GitHub repository again.
2. In the detected applications list, choose **Import single project** for the **Django** application (`backend`, not the Next.js row).
3. Set **Root Directory** to `backend` and let Vercel detect Django/Python. Keep the install command that installs `requirements.txt`; set **Build Command** to `python build.py`.
4. In the Django project's **Settings → Environment Variables**, enable access to Vercel System Environment Variables. Django uses `VERCEL`, `VERCEL_URL`, and `VERCEL_PROJECT_PRODUCTION_URL` to set serverless cache/database behavior and accept the Vercel hostnames.
5. Add these Environment Variables for the **Production** environment only:
   - `DATABASE_URL`: the Neon pooled connection string.
   - `DJANGO_DEBUG`: `false`.
   - `DJANGO_SECRET_KEY`: a private random value. Generate one locally with `python -c "import secrets; print(secrets.token_urlsafe(64))"` and paste it into Vercel.
   - `STEMAWY_CORS_ALLOWED_ORIGINS`: the Next.js website's production origin, including `https://`.
6. Deploy the Django project. `backend/build.py` runs migrations during production builds when `DATABASE_URL` is present. Vercel automatically collects Django static files.
7. Copy the Django project's stable production URL, such as `https://your-api.vercel.app`.

The API URLs use that hostname with `/api/`; the admin is at `/admin/`. Use the Vercel **production domain**, not a temporary deployment URL.

## 4. Load the Catalog and Create the Admin User

Vercel's Django project root is `backend`, while catalog JSON files are outside that directory. Therefore, seed the new Neon database once from your local project after the Django Vercel project has deployed:

1. Open PowerShell in the repository's `backend` directory.
2. If you do not already have a local virtual environment for this backend, create one and install the requirements:

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\python.exe -m pip install -r requirements.txt
   ```

3. Set the database URL for this terminal session. Paste your Neon pooled connection string at the prompt; do not share it or commit it:

   ```powershell
   $env:DATABASE_URL = Read-Host "Paste the Neon DATABASE_URL"
   ```

4. Import the catalog and create your Django admin account:

   ```powershell
   .\.venv\Scripts\python.exe manage.py migrate --noinput
   .\.venv\Scripts\python.exe manage.py import_migrated_data --apply
   .\.venv\Scripts\python.exe manage.py createsuperuser
   ```

5. Clear the connection string from the terminal session when finished:

   ```powershell
   Remove-Item Env:DATABASE_URL
   ```

The importer is additive: it adds missing catalog records and does not overwrite existing admin edits. The announcements endpoint is `https://your-api.vercel.app/api/announcements/`.

## 5. Connect the Website to Django

1. Open the existing Next.js Vercel project and go to **Settings → Environment Variables**.
2. Add `NEXT_PUBLIC_STEMAWY_API_URL` for **Production**, with the Django URL ending in `/api`, such as `https://your-api.vercel.app/api`.
3. Save and redeploy the Next.js project. The frontend reads this variable at build time.
4. Open the website and check the catalog pages. Sign in at `https://your-api.vercel.app/admin/`, publish a test announcement, and check the notification bell.

## 6. Add Your Domain Later

Add your domain to the Next.js Vercel project and follow Vercel's DNS instructions. Then update `STEMAWY_CORS_ALLOWED_ORIGINS` in the Django Vercel project to the custom website origin and redeploy Django. If you later give Django a custom domain too, update `DJANGO_ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` to match it.

## Free-Tier Limits

- Vercel Hobby is limited to personal, non-commercial use and has monthly function/build quotas. Django runs as serverless functions, so it is not an always-on server; observe Vercel's current function limits and usage dashboard.
- Neon Free has storage, compute, and egress caps. If a usage cap is reached, database access may be suspended or writes blocked until the quota resets; it does not provide scheduled backups.
- About 3,000 users over time may fit, but account count alone cannot predict request volume. Monitor actual Vercel function invocations, compute time, database storage, and egress.
- The feedback route currently sends email through Gmail SMTP. Vercel Functions may restrict outbound SMTP; if feedback delivery fails, switch that route to an HTTPS email API.

## Local Preflight

From the project root:

```powershell
Push-Location backend
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test content
python manage.py check --deploy
python manage.py collectstatic --dry-run --noinput
Pop-Location
npm ci
npm run lint
npm run build
```
