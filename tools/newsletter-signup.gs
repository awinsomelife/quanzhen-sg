/**
 * @OnlyCurrentDoc
 *
 * SG Taoist Newsletter (星洲道誌) — sign-up receiver
 *
 * Receives the sign-up form on quanzhen.sg/newsletter/ and adds each new
 * subscriber to the "Subscribers" tab of the Google Sheet this script is
 * attached to.
 *
 * Security
 * - @OnlyCurrentDoc above limits the script's Google permission to THIS
 *   spreadsheet only. It cannot open your other files, Gmail or Drive.
 * - Every sign-up must carry a Cloudflare Turnstile token that Cloudflare
 *   confirms was solved on quanzhen.sg in the last 5 minutes. Requests
 *   sent straight to this URL by a script fail. If the secret key is not
 *   set, all sign-ups are refused.
 * - At most MAX_PER_10_MIN and MAX_PER_6_HOURS new rows are added, so even a
 *   determined attack can only add a limited number of junk rows.
 * - It only ever ADDS rows. It never reads back, changes or deletes
 *   existing rows, and every reply is the same, so nobody can use it to
 *   find out who is subscribed.
 * - Text is length-capped, stripped of control characters, and prefixed
 *   so it can never run as a spreadsheet formula.
 *
 * Setup (once):
 *   1. Open the Google Sheet → Extensions → Apps Script.
 *   2. Replace everything in Code.gs with this file and click Save.
 *   3. Project Settings (gear icon) → Script Properties → Add property:
 *        Property: TURNSTILE_SECRET   Value: <Turnstile secret key>
 *   4. Deploy → New deployment → type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone
 *      Click Deploy and allow access when Google asks.
 *   5. Copy the Web app URL (ends in /exec) for the website.
 *
 * If you edit this script later, use Deploy → Manage deployments →
 * Edit → Version: New version, so the URL stays the same.
 */

const SHEET_NAME = 'Subscribers';
const MAX_PER_10_MIN = 20;
const MAX_PER_6_HOURS = 100;

// Sites allowed to show the sign-up box (checked against Cloudflare's answer).
const ALLOWED_HOSTS = ['quanzhen.sg', 'www.quanzhen.sg'];
const ALLOWED_HOST_SUFFIX = '.quanzhen-sg.pages.dev'; // preview builds

function doPost(e) {
  try {
    handle_((e && e.parameter) || {});
  } catch (err) {
    console.error(err);
  }
  // Always the same answer: success or failure reveals nothing.
  return ContentService.createTextOutput('{"ok":true}')
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput('');
}

function handle_(p) {
  // 1. Spam trap: a hidden field real people never fill in.
  if (p.website) return;

  // 2. Basic checks before spending anything on the request.
  const email = String(p.email || '').trim().toLowerCase();
  if (!isEmail_(email)) return;

  // 3. Proof the form was filled in on our site by a person.
  if (!turnstileOk_(String(p['cf-turnstile-response'] || ''))) return;

  // 4. Rate limits, then add the row.
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;
  try {
    if (!withinLimits_()) return;

    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existing = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (let i = 0; i < existing.length; i++) {
        if (String(existing[i][0]).toLowerCase() === email) return; // already listed
      }
    }

    const page = String(p.page || '');
    sheet.appendRow([
      new Date(),
      email,
      clean_(p.name, 120),
      p.lang === 'zh' ? '中文' : 'English',
      /^\/newsletter\/[a-z0-9\-\/]*$/.test(page) ? page : '',
      '',
    ]);
    countSignup_();
  } finally {
    lock.releaseLock();
  }
}

function isEmail_(email) {
  return email.length >= 6 && email.length <= 254 &&
    /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(email) &&
    !/^[=+\-@]/.test(email);
}

function turnstileOk_(token) {
  const secret = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');
  if (!secret || !token || token.length > 2048) return false;
  const res = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: { secret: secret, response: token },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) return false;
  const data = JSON.parse(res.getContentText());
  const host = String(data.hostname || '');
  return data.success === true &&
    (ALLOWED_HOSTS.indexOf(host) !== -1 || host.slice(-ALLOWED_HOST_SUFFIX.length) === ALLOWED_HOST_SUFFIX);
}

// Counts new rows per 10-minute and 6-hour window (6 hours is the
// longest Apps Script keeps a cached value).
function withinLimits_() {
  const cache = CacheService.getScriptCache();
  const k = keys_();
  return Number(cache.get(k.tenMin) || 0) < MAX_PER_10_MIN &&
         Number(cache.get(k.sixHours) || 0) < MAX_PER_6_HOURS;
}

function countSignup_() {
  const cache = CacheService.getScriptCache();
  const k = keys_();
  cache.put(k.tenMin, String(Number(cache.get(k.tenMin) || 0) + 1), 660);
  cache.put(k.sixHours, String(Number(cache.get(k.sixHours) || 0) + 1), 21600);
}

function keys_() {
  const now = Date.now();
  return { tenMin: 'n10_' + Math.floor(now / 600000), sixHours: 'n6h_' + Math.floor(now / 21600000) };
}

// Trim, cap length, drop control characters, never start like a formula.
function clean_(value, max) {
  const v = String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
