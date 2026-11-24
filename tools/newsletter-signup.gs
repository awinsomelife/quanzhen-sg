/**
 * SG Taoist Newsletter (星洲道誌) — sign-up receiver
 *
 * Receives the sign-up form on quanzhen.sg/newsletter/ and adds each
 * subscriber to the "Subscribers" tab of the Google Sheet this script
 * is attached to.
 *
 * Setup (once):
 *   1. Open the Google Sheet → Extensions → Apps Script.
 *   2. Replace everything in Code.gs with this file and click Save.
 *   3. Deploy → New deployment → type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone
 *      Click Deploy and allow access when Google asks.
 *   4. Copy the Web app URL (ends in /exec) and put it in
 *      _data/journal.js as signupUrl.
 *
 * If you edit this script later, use Deploy → Manage deployments →
 * Edit → Version: New version, so the URL stays the same.
 */

const SHEET_NAME = 'Subscribers';

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Hidden "website" field: real people leave it empty, spam bots fill it in.
  if (p.website) return reply_({ ok: true });

  const email = String(p.email || '').trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@=+\-][^\s@]*@[^\s@]+\.[^\s@]+$/.test(email)) {
    return reply_({ ok: false, error: 'invalid-email' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    const lastRow = sheet.getLastRow();

    // Already on the list? Clear "Unsubscribed" in case they're rejoining.
    if (lastRow > 1) {
      const emails = sheet.getRange(2, 2, lastRow - 1, 1).getValues()
        .map(function (r) { return String(r[0]).toLowerCase(); });
      const i = emails.indexOf(email);
      if (i !== -1) {
        sheet.getRange(i + 2, 6).setValue('');
        return reply_({ ok: true, existing: true });
      }
    }

    sheet.appendRow([
      new Date(),
      email,
      clean_(p.name),
      p.lang === 'zh' ? '中文' : 'English',
      clean_(p.page),
      '',
    ]);
  } finally {
    lock.releaseLock();
  }
  return reply_({ ok: true });
}

// Trim, cap length, and stop text being read as a spreadsheet formula.
function clean_(value) {
  const v = String(value || '').trim().slice(0, 200);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
