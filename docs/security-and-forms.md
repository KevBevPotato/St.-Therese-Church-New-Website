# Deployment security and public form setup

## Important: rotate the old form credential

The prior Apps Script shared form token was included in browser-delivered source. Treat it as exposed even though it has now been removed from the current code. Revoke/rotate it in Apps Script and retire or restrict the old public Apps Script deployment after the replacement is live. Removing a value from Git does not revoke it, and it remains in Git history unless history is deliberately rewritten.

The replacement endpoint does not send email notifications. It saves submissions to Google Sheets and returns success only after the Sheets API confirms the append.

## Google Sheets setup

1. Create a dedicated Google Cloud service account and enable the Google Sheets API for its project.
2. Share only the target submissions spreadsheet with the service-account email. Grant the least privilege needed to append/read header rows.
3. Set the Vercel server-only environment variables from `.env.example`:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (paste the private key as supplied; escaped `\n` is also accepted)
   - `GOOGLE_SHEETS_SPREADSHEET_ID`
4. Create or verify these tabs and their first-row column headers:
   - `Membership Registration`
   - `Pledges`
   - `Signups`
   - `Suggestions`
   - `Referrals`
   - `WednesdaySupperVolunteers`
   - `Lector Signups`
5. Headers must normalize to the submission field names sent by the relevant form. The endpoint refuses to append if any non-empty submitted field lacks a matching column. `name`, `full_name`, `email`, `phone`, `timestamp`, `date_submitted`, `submission_date`, and `form` are supported aliases. Keep a `submitted_at` (or timestamp alias) column to record server time.
6. For the membership form, add headers for the submitted fields in the `Membership Registration` tab. Primary-contact headers use names such as `family_name`, `first_name`, `street_address`, `city`, `zip_code`, `email`, `phone`, `marital_status`, `church_attendance`, and `child_count`. Adult detail headers use `head_` and `spouse_` prefixes (for example, `head_date_of_birth`, `head_baptism_year`, and `spouse_marriage_date`). Child detail headers use `child_1_` through `child_12_` (for example, `child_1_first_name`, `child_1_gender`, and `child_1_confirmation_year`). Use a first-row column for every field the form should save; blank optional values do not require a populated column, but any entered value without a matching header is rejected.
7. For Get Involved interest forms, the `Signups` tab must include `from_name`, `from_email`, `from_phone`, `interest`, `context_opportunity`, `signup_kind`, `availability`, `notes`, `participant_name`, `participant_grade`, `guardian_name`, and `submitted_at`. `from_phone`, availability, notes, participant details, and guardian name may be blank for signups that do not use them. The Faith Formation form lets a person express catechist/helper interest or request class-registration information. The Wednesday Supper landing page uses its date- and role-specific form and saves those submissions to `WednesdaySupperVolunteers`.

Do not put service-account credentials, Upstash credentials, or any private key in `client/`, `VITE_*` variables, public assets, or Git commits. Configure them for Development/Preview/Production in Vercel as appropriate. Local `.env.local` is ignored by Git.

Membership registrations contain contact details, religious/sacramental information, and information about children. Restrict access to the `Membership Registration` tab to staff who need it, use a separate test sheet for Preview, and establish an appropriate retention/deletion policy. Do not send test registrations containing real family or child information.

Get Involved signups contain personal contact details. Limit access to the `Signups` tab to staff responsible for follow-up. The form collects a phone number for contact but does not enroll the person in SMS messaging.

## Rate limiting

The endpoint uses Upstash Redis REST to enforce a fixed-window limit of 6 submissions per IP per minute. Configure both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in Vercel. If rate limiting is unavailable or not configured, the endpoint fails closed and returns a temporary-unavailable response. The hidden form field is an additional basic bot trap, not a substitute for rate limiting or CAPTCHA.

## Vercel and CMS

- Deploy the root project so Vercel detects `api/submit.ts` as a serverless function; the SPA fallback rewrite remains in place for browser routes.
- Keep Google and Upstash variables server-only. Preview deployments must not use production Sheets credentials unless intentionally approved; prefer a separate test spreadsheet and separate service identity for Preview.
- `VITE_FRONTEND_FORGE_API_KEY` is intentionally sent to browsers for the map integration; treat it as a public, restricted client key, not a secret. Restrict it in the provider dashboard to the production/preview origins and required map APIs, and set quotas. Keep `BUILT_IN_FORGE_API_KEY` server-only.
- Keep DecapBridge's PKCE backend. The site/bridge identifiers in `client/public/admin/config.yml` are public routing configuration, not credentials. Manage editor membership and bridge/site permissions in their respective services. Do not add a GitHub personal access token to the CMS config.
- Enable available GitHub secret scanning and push protection for this repository, and protect the production branch/deployments. Review Vercel deployment protection so unpublished previews are not unintentionally public.

## Verification and incident response

- Exercise each public submission form after setting Vercel variables; verify each row lands in the correct tab and invalid fields, cross-origin requests, honeypot submissions, and rate-limited requests are rejected.
- Check built browser assets for old Apps Script URLs/tokens and scan Git history with secret-scanning tools. Do not paste token values into issues, logs, or reports.
- Rotate any accidentally exposed credential first. History rewriting is optional, disruptive to collaborators, and never a substitute for revocation.
- Review spreadsheet sharing, service-account access, and submission retention periodically.
