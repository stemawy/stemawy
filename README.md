This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Feedback Email

Feedback is sent through Gmail SMTP. Copy `.env.example` to `.env.local`, set `FEEDBACK_GMAIL_USER` to the Gmail account that will send the email, enable 2-Step Verification on that account, and create a Google App Password for `FEEDBACK_GMAIL_APP_PASSWORD`. Keep that secret in `.env.local`; never commit it. The legacy site used `yassoalaa822@gmail.com` as a `mailto:` recipient, not as a confirmed sender. Testing currently sends to `youssefbhaa2010@gmail.com`; change `FEEDBACK_TO_EMAIL` to `yassoalaa822@gmail.com` when ready for production. Restart the Next.js server after changing environment values.

## Deploy the Full App

For the Render Blueprint, deployment steps, production caveats, and free-tier data limits, see [DEPLOYMENT.md](DEPLOYMENT.md). The frontend and Django API must both be deployed; the Next.js app alone does not include the editable catalog or admin.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
