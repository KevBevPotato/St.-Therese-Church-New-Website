# Deployment security and public form setup

## Important: rotate the old form credential

The prior Apps Script shared form token was included in browser-delivered source. Treat it as exposed even though it has now been removed from the current code. Revoke/rotate it in Apps Script and retire or restrict the old public Apps Script deployment after the replacement is live. Removing a value from Git does not revoke it, and it remains in Git history unless history is deliberately rewritten.

The replacement endpoint does not send email notifications. It forwards submissions to a private Power Automate flow and returns success only after the flow returns a successful response.

## Microsoft Excel setup

1. Create a Power Automate cloud flow with the **When an HTTP request is received** trigger. Add Excel Online (Business) **Add a row into a table** actions for each destination below, selected by the incoming `destination` value.
2. In the workbook, create a formatted Excel table for each destination. The existing destination names are:
   - `Membership Registration`
   - `Pledges`
   - `Signups`
   - `Suggestions`
   - `Referrals`
   - `WednesdaySupperVolunteers`
   - `Lector Signups`
3. Configure the flow to map the incoming JSON properties to the matching table columns. The request includes `destination`, `form_type`, the submitted form fields, and `submitted_at`. Membership child sections arrive as fields such as `child_1_first_name`, `child_1_last_name`, continuing through `child_12_*`; create/map columns for the fields you want to save.
4. For each Excel table, use column names matching the request properties. The existing Google Sheets implementation used first-row headers, but the flow is responsible for mapping Excel columns and should handle blank optional values. The `Signups` destination receives Get Involved interest forms. Wednesday Supper volunteers are sent to `WednesdaySupperVolunteers`.
5. Add a **Response** action after the Excel write succeeds and return HTTP 200 with JSON such as `{"success":true}`. Return a non-2xx status if Excel fails; the website displays a success message only after it receives a successful response.
6. Save the flow, copy its HTTP POST URL, and set it as `POWER_AUTOMATE_FLOW_URL` in Vercel for Production (and a test flow for Preview/Development). This URL contains a signing credential: keep it server-only, never use a `VITE_` prefix, and do not paste it into source, logs, or chat.

The form endpoint is `/api/submit`; the browser already sends JSON there, including dynamic child fields, and handles success/error states. Microsoft Graph's Excel table-row API does not support application permissions, so the `MS_CLIENT_ID`, `MS_TENANT_ID`, `MS_CLIENT_SECRET`, and `EXCEL_FILE_ID` variables are not used by this Power Automate integration. They can be removed from Vercel after confirming no other project feature uses them. Do not put the flow URL or Upstash credentials in `client/`, `VITE_*` variables, public assets, or Git commits. Local `.env.local` is ignored by Git.

Membership registrations contain contact details, religious/sacramental information, and information about children. Restrict access to the `Membership Registration` tab to staff who need it, use a separate test sheet for Preview, and establish an appropriate retention/deletion policy. Do not send test registrations containing real family or child information.

Get Involved signups contain personal contact details. Limit access to the `Signups` tab to staff responsible for follow-up. The form collects a phone number for contact but does not enroll the person in SMS messaging.

## Rate limiting

The endpoint uses Upstash Redis REST to enforce a fixed-window limit of 6 submissions per IP per minute. Configure both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in Vercel. If rate limiting is unavailable or not configured, the endpoint fails closed and returns a temporary-unavailable response. The hidden form field is an additional basic bot trap, not a substitute for rate limiting or CAPTCHA.

## Vercel and CMS

- Deploy the root project so Vercel detects `api/submit.ts` as a serverless function; the SPA fallback rewrite remains in place for browser routes.
- Keep the Power Automate flow URL and Upstash variables server-only. Preview deployments should use a separate test flow/workbook unless production submissions from Preview are intentionally approved.
- `VITE_FRONTEND_FORGE_API_KEY` is intentionally sent to browsers for the map integration; treat it as a public, restricted client key, not a secret. Restrict it in the provider dashboard to the production/preview origins and required map APIs, and set quotas. Keep `BUILT_IN_FORGE_API_KEY` server-only.
- Keep DecapBridge's PKCE backend. The site/bridge identifiers in `client/public/admin/config.yml` are public routing configuration, not credentials. Manage editor membership and bridge/site permissions in their respective services. Do not add a GitHub personal access token to the CMS config.
- Enable available GitHub secret scanning and push protection for this repository, and protect the production branch/deployments. Review Vercel deployment protection so unpublished previews are not unintentionally public.

## Verification and incident response

- Exercise each public submission form after setting Vercel variables; verify each row lands in the correct Excel table and invalid fields, cross-origin requests, honeypot submissions, and rate-limited requests are rejected.
- Check built browser assets for old Apps Script URLs/tokens and scan Git history with secret-scanning tools. Do not paste token values into issues, logs, or reports.
- Rotate any accidentally exposed credential first. History rewriting is optional, disruptive to collaborators, and never a substitute for revocation.
- Review spreadsheet sharing, service-account access, and submission retention periodically.
