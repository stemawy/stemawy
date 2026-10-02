# Public Deployment

For a no-cost, non-commercial deployment, use **Vercel Hobby for Next.js**, **Render Free for the Django API**, and **Neon Free for PostgreSQL**. The Render Blueprint in this repository creates only the API; it does not create a Render database that expires after 30 days or a second frontend service.

This setup can be a reasonable starting point for roughly 3,000 active users spread over time, but free plans have quotas and no uptime guarantees. User count alone cannot predict usage; monitor real traffic, database compute, and network transfer after launch.

## Before You Start

- Push the project, including `render.yaml`, to the GitHub repository connected to Vercel and Render.
- Create accounts on Vercel, Neon, and Render. Do not select paid plans or enable billing if your budget must remain zero.
- Vercel Hobby is restricted to personal, non-commercial use. Confirm that your project ownership/use meets Vercel's terms; being educational does not automatically make an organization eligible for Hobby.
- Keep database URLs, Django admin credentials, and all generated secrets private. Enter them only into the provider's secret environment-variable fields.

## 1. Deploy the Website to Vercel

1. In Vercel, choose **Add New → Project** and import the GitHub repository.
2. Leave the project root at the repository root and let Vercel detect Next.js. Keep the default build command (`npm run build`) and output settings.
3. Deploy. The site can build before the API is connected because the frontend has bundled catalog fallbacks.
4. Copy the production URL Vercel assigns, such as `https://your-project.vercel.app`. You'll add it to the API's allowed CORS origins in step 3.

## 2. Create the Persistent Free Database

1. In Neon, create a PostgreSQL project on the **Free** plan. Pick the same region as the Render API (Render defaults to Oregon unless changed).
2. In Neon, copy the **direct** connection string for the database. Keep it private. It contains database credentials and should not be committed to GitHub.
3. The connection string must use TLS (`sslmode=require`). Neon supplies this in its connection string; keep the query options intact.

Neon Free does **not** have Render's 30-day expiry. It has a 1 GB database limit, 100 compute-hours per project each month, and 5 GB monthly public network transfer. Database compute suspends after five minutes idle and resumes on demand. If compute or transfer quotas run out, the database suspends until the allowance resets; exceeding a free quota does not automatically delete the data. Neon Free has no scheduled backups, so export important data regularly.

## 3. Deploy the Django API to Render

1. In Render, choose **New → Blueprint** and connect the same GitHub repository.
2. Render reads `render.yaml`. It should show one service: `stemawy-api`, on the **Free** plan. It should not create a Render database.
3. During setup, provide the prompted environment values:
   - `DATABASE_URL`: the Neon direct connection string from step 2.
   - `STEMAWY_CORS_ALLOWED_ORIGINS`: the exact Vercel production origin, including `https://`, with no path. Example: `https://your-project.vercel.app`.
   - `DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_EMAIL`, and `DJANGO_SUPERUSER_PASSWORD`: credentials for the initial admin account. Use a unique, strong password.
4. Apply the Blueprint. Render generates the Django secret key automatically. The API startup applies migrations and safely imports missing catalog rows. The initial-deploy hook creates the admin user once.
5. Wait until `stemawy-api` is **Live**. Its URL will look like `https://stemawy-api.onrender.com`. The admin is at `/admin/`; the announcements API is at `/api/announcements/`.
6. After the first successful deploy, remove `DJANGO_SUPERUSER_PASSWORD` from the Render service's environment settings.

Render Free services sleep after 15 minutes without traffic and may take about a minute to wake. This means the first website request after an idle period can be slow. Render's free filesystem is temporary, but that is okay here because database content is stored in Neon.

## 4. Connect Vercel to the API

1. In Vercel, open the project, then **Settings → Environment Variables**.
2. Add `NEXT_PUBLIC_STEMAWY_API_URL` with the API URL ending in `/api`, for example `https://stemawy-api.onrender.com/api`.
3. Apply it to **Production** and save.
4. In Vercel, open **Deployments** and redeploy the latest production deployment. This variable is read at build time.
5. Open the Vercel site, check the subject/opportunity/skill pages, then publish an announcement in Django admin and verify it appears in the notification bell.

## 5. Add Your Domain Later

When ready, add your domain in Vercel's project **Settings → Domains** and follow the DNS instructions Vercel shows for your domain registrar. After the domain works over HTTPS:

- Update Render's `STEMAWY_CORS_ALLOWED_ORIGINS` to include the new website origin (for example, `https://example.com`). Multiple origins can be comma-separated.
- Redeploy the Render API after changing its environment variable.
- Set `NEXT_PUBLIC_STEMAWY_API_URL` on Vercel if you later give the API its own domain, then redeploy the website.

## Free-Plan Limits and Tradeoffs

- Vercel Hobby is free for personal, non-commercial projects, but has monthly usage limits. If a limit is reached, some features pause until the allowance resets.
- Render Free API services sleep after 15 idle minutes and cold-start on the next request. They have limited monthly instance hours and no persistent local disk.
- Neon Free persists data without a fixed 30-day deletion, but is limited to 1 GB storage, 100 compute-hours/project/month, and 5 GB egress/project/month. Compute scales to zero after five idle minutes. The free tier has no scheduled backups or uptime SLA.
- Free-plan limits can change. Check the provider dashboards and current terms before deploying, monitor usage, and keep independent database exports. Never assume 3,000 users will fit a quota without measuring actual traffic.
- Render Free blocks outbound SMTP ports. The feedback endpoint's Gmail SMTP delivery will return `503` on this plan; other site features can still work. An HTTPS email API could be integrated separately if its free terms fit.

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

The production check may warn that HSTS subdomain inclusion and browser preload are disabled. Those settings are intentionally not enabled automatically because they depend on domain ownership and HTTPS coverage for every subdomain.
