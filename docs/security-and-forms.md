# Deployment security and public form setup

## Important: rotate the old form credential

The prior Apps Script shared form token was included in browser-delivered source. Treat it as exposed even though it has now been removed from the current code. Revoke/rotate it in Apps Script and retire or restrict the old public Apps Script deployment after the replacement is live. Removing a value from Git does not revoke it, and it remains in Git history unless history is deliberately rewritten.

The endpoint does not send email notifications or use Power Automate/Excel. It writes submissions directly to Google Sheets and returns success only after the row is saved.

## Google Sheets setup

1. Create or choose the Google spreadsheet for form submissions. Create a Google service account and share the spreadsheet with its email address, granting Editor access.
2. Set these server-only variables in Vercel for each deployment environment: `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY`. The private key may use literal `\n` line breaks; the API converts them to newlines. `.env.example` lists the variable names.
3. Deploy the project with `api/submit.ts` available as a Vercel serverless function. The endpoint is `/api/submit`. It creates the destination worksheet if it does not exist and adds submission fields as headers when needed.
4. Faith Formation registrations, including the “Register!” form, are written to the `Faith Formation` worksheet. Parish membership registrations go to `Parish Registrations`; other forms are routed by form type in `api/submit.ts`.
5. Verify the row appears in the expected worksheet after a test submission. The endpoint only reports success after Google Sheets accepts the row. If Google Sheets configuration is missing or the write fails, it returns an error; there is no local database or email backup.

Form submissions may contain personal contact details and, for registrations, information about children and religious/sacramental details. Restrict spreadsheet access to staff who need it, use a separate spreadsheet for Preview/testing where appropriate, and establish an appropriate retention/deletion policy. Do not send test registrations containing real family or child information.

## Vercel and CMS

- Deploy the root project so Vercel detects `api/submit.ts` as a serverless function; the SPA fallback rewrite remains in place for browser routes.
- Keep Google service-account credentials server-only. Preview deployments should use a separate test spreadsheet unless production submissions from Preview are intentionally approved. Do not put credentials in `client/`, `VITE_*` variables, public assets, or Git commits. Local `.env.local` is ignored by Git.
- `VITE_FRONTEND_FORGE_API_KEY` is intentionally sent to browsers for the map integration; treat it as a public, restricted client key, not a secret. Restrict it in the provider dashboard to the production/preview origins and required map APIs, and set quotas. Keep `BUILT_IN_FORGE_API_KEY` server-only.
- Keep DecapBridge's PKCE backend. The site/bridge identifiers in `client/public/admin/config.yml` are public routing configuration, not credentials. Manage editor membership and bridge/site permissions in their respective services. Do not add a GitHub personal access token to the CMS config.
- Enable available GitHub secret scanning and push protection for this repository, and protect the production branch/deployments. Review Vercel deployment protection so unpublished previews are not unintentionally public.

## Verification and incident response

- Exercise each public submission form after setting Vercel variables and verify each row lands in the expected Google Sheets worksheet. Also verify invalid fields, cross-origin requests, and honeypot submissions are rejected.
- Check built browser assets for old Apps Script URLs/tokens and scan Git history with secret-scanning tools. Do not paste token values into issues, logs, or reports.
- Rotate any accidentally exposed credential first. History rewriting is optional, disruptive to collaborators, and never a substitute for revocation.
- Review spreadsheet sharing, service-account access, and submission retention periodically.
