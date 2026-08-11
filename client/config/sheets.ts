/**
 * Google Sheets / Apps Script Configuration
 *
 * SECURITY (Option 3 — Anyone access + shared secret):
 *   - The Apps Script is deployed with "Anyone" access so browsers can call it
 *   - But it ALSO requires a matching API_KEY in the request payload
 *   - This blocks casual misuse while still allowing browser fetch
 *
 * TO CHANGE THE SECURITY TOKEN LATER:
 *   1. Update `apiKey` in this file
 *   2. Update `var API_KEY = '...'` in the Apps Script code
 *   3. Both must match exactly
 *   4. To remove the token check entirely, set `apiKey: null` here AND in the Apps Script
 */

export const SHEETS_CONFIG = {
    /** Your deployed Apps Script Web App URL — Anyone access, with token check */
    webAppUrl: 'https://script.google.com/macros/s/AKfycbxZ6q7oAbMEmG6X9NmCMyWi_3ukekb2cywDgngQ65thZ9VIBWpdw0_Ahu7WHTeO2Mdi/exec',

    /**
     * Shared secret token. Must match the `API_KEY` variable in your Apps Script.
     * Change this anytime — just keep both files in sync.
     */
    apiKey: 'parishpledge2026',

    /** Email for parish coordinator (where pledges are also notified) */
    toEmail: 'kbaltzer@diorc.org',

    /** Sheet URL for "View all pledges" in notification emails — fill in after creating */
    sheetUrl: 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit',
};
