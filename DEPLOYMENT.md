# Public Deployment

This repository includes a Render Blueprint for a public trial deployment. It creates a Next.js web service, a Django API, and a private PostgreSQL database. The Blueprint uses Render's free plans, which are for evaluation only and have important data and uptime limits.

## Before You Start

- Push this repository and the `render.yaml` file to GitHub.
- Create or sign in to a Render account and connect the GitHub repository.
- Generate a Django secret with `python -c "import secrets; print(secrets.token_urlsafe(64))"` and provide it when Render prompts for `DJANGO_SECRET_KEY`.
- During Blueprint setup, enter a strong, unique password for `DJANGO_SUPERUSER_PASSWORD`, plus the username and email for the initial Django admin account. Render stores these as secret environment variables.
- Review the resources and plans Render proposes before confirming. Do not add a payment method or select a paid plan unless you intend to pay for it.

## Deploy

1. In Render, choose **New** then **Blueprint** and select this repository.
2. Review the `stemawy-web`, `stemawy-api`, and `stemawy-db` resources. The database is private to the Render services.
3. Provide the initial Django admin username, email, and password when prompted, then apply the Blueprint.
4. Wait for both web services to report **Live**. The API startup command applies migrations and performs the repository's additive catalog import. The initial-deploy hook creates the admin user once.
5. Open the `stemawy-web` URL for the site. The API is available at the `stemawy-api` URL, with the admin at `/admin/` and the announcements endpoint at `/api/announcements/`.
6. Log into Django admin and verify subjects, opportunities, skills, and announcements. Publish an announcement and check the website notification bell.
7. After the first successful deploy, remove `DJANGO_SUPERUSER_PASSWORD` from the API service's environment settings. The hook runs only on the initial deploy, so keeping the bootstrap secret is unnecessary.

Render supplies each service's hostname. The Blueprint passes those hostnames into CORS, CSRF, and the frontend API URL settings. Django also generates a secret key, requires HTTPS in production, and serves admin static files through WhiteNoise.

## Free-Tier Limits

Render free web services sleep after 15 minutes without traffic and can take about a minute to wake. Their local files are temporary, so the deployment uses PostgreSQL rather than SQLite. Free PostgreSQL expires 30 days after creation, has no backups, and is eventually deleted if it is not upgraded. Do not put important production content in this database. Upgrade the database and web services to suitable paid plans, and configure backups, before treating this as a permanent public site.

Feedback email is not ready on the free plan: Render blocks outbound SMTP ports for free services. The feedback endpoint will return `503` until you use a paid service or switch delivery to an email provider's HTTPS API and configure its credentials.

## Custom Domains

Add custom domains in Render for both services, then update `STEMAWY_CORS_ALLOWED_ORIGINS` on the API to the exact website origin, `CSRF_TRUSTED_ORIGINS` to the admin/API origin, and `DJANGO_ALLOWED_HOSTS` to the API hostname. Set `NEXT_PUBLIC_STEMAWY_API_URL` on the web service to the API's HTTPS URL ending in `/api`. Redeploy the frontend after changing this public build-time variable.

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

The production check may warn that HSTS subdomain inclusion and browser preload are disabled. Those options are intentionally not enabled automatically because they depend on domain ownership and HTTPS coverage for every subdomain.
