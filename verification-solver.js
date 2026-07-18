const puppeteer = require('puppeteer');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

// ============================================================
// CAPTCHA / VERIFICATION SOLVER
// Uses Puppeteer + Tesseract.js OCR to automatically solve
// Discord server verification (CAPTCHA, membership screening)
// ============================================================

const SESSIONS_DIR = './sessions';
if (!fs.existsSync(SESSIONS_DIR)) fs.mkdirSync(SESSIONS_DIR, { recursive: true });

/**
 * Solve server verification for a bot using its token
 * @param {string} token - Discord bot/user token
 * @param {string} inviteCode - Invite code (e.g., "discord" or full URL)
 * @param {number} botIndex - Bot index for logging
 * @returns {Promise<{success: boolean, method: string, error?: string}>}
 */
async function solveServerVerification(token, inviteCode, botIndex = 0) {
  const inviteUrl = inviteCode.includes('discord.gg/') || inviteCode.includes('discord.com/invite/')
    ? inviteCode
    : `https://discord.gg/${inviteCode}`;

  console.log(`🔍 [Bot ${botIndex}] Starting verification solver for ${inviteUrl}`);

  let browser = null;
  try {
    const execPath = process.env.PUPPETEER_EXECUTABLE_PATH || undefined;
    const headless = (process.env.PUPPETEER_HEADLESS || 'true') === 'true';

    browser = await puppeteer.launch({
      headless,
      executablePath: execPath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-size=1280,800',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set longer timeout for navigation
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);

    // Step 1: Login to Discord with token
    console.log(`🔑 [Bot ${botIndex}] Logging in with token...`);
    await page.goto('https://discord.com/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);

    // Inject token into localStorage
    await page.evaluate((t) => {
      window.localStorage.setItem('token', JSON.stringify(t));
    }, token);

    // Step 2: Navigate to the invite
    console.log(`🔗 [Bot ${botIndex}] Navigating to invite: ${inviteUrl}`);
    await page.goto(inviteUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForTimeout(3000);

    // Step 3: Take a screenshot for debugging
    const screenshotPath = path.join(SESSIONS_DIR, `verify-bot${botIndex}-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`📸 [Bot ${botIndex}] Screenshot saved: ${screenshotPath}`);

    // Step 4: Check current URL - if we're on a channel, we're already in
    const currentUrl = page.url();
    if (currentUrl.includes('/channels/')) {
      console.log(`✅ [Bot ${botIndex}] Already in server or invite accepted`);
      return { success: true, method: 'already-in-server' };
    }

    // Step 5: Look for and click the "Accept Invite" button
    const acceptButtonSelectors = [
      'button[class*="accept"]',
      'button[class*="button"]:not([class*="disabled"])',
      'button:has-text("Accept")',
      'button:has-text("Join")',
      'button:has-text("Continue")',
      'div[class*="acceptButton"]',
      'button[type="submit"]'
    ];

    let acceptClicked = false;
    for (const selector of acceptButtonSelectors) {
      try {
        const btn = await page.$(selector);
        if (btn) {
          const text = await page.evaluate(el => el.textContent.trim().toLowerCase(), btn);
          if (text.includes('accept') || text.includes('join') || text.includes('continue')) {
            await btn.click();
            console.log(`🖱️ [Bot ${botIndex}] Clicked accept button: "${text}"`);
            acceptClicked = true;
            await page.waitForTimeout(3000);
            break;
          }
        }
      } catch (e) {
        // selector might not exist, continue
      }
    }

    // If no button found, try clicking any primary button
    if (!acceptClicked) {
      try {
        const buttons = await page.$$('button');
        for (const btn of buttons) {
          const text = await page.evaluate(el => el.textContent.trim().toLowerCase(), btn);
          if (text.includes('accept') || text.includes('join') || text.includes('continue')) {
            await btn.click();
            console.log(`🖱️ [Bot ${botIndex}] Clicked button: "${text}"`);
            acceptClicked = true;
            await page.waitForTimeout(3000);
            break;
          }
        }
      } catch (e) {
        console.log(`⚠️ [Bot ${botIndex}] Could not find accept button`);
      }
    }

    // Step 6: Check for CAPTCHA / hCaptcha
    await page.waitForTimeout(2000);
    const captchaResult = await detectAndSolveCaptcha(page, botIndex);
    
    if (captchaResult.solved) {
      console.log(`✅ [Bot ${botIndex}] CAPTCHA solved via ${captchaResult.method}`);
      await page.waitForTimeout(3000);
    } else if (captchaResult.found) {
      console.log(`⚠️ [Bot ${botIndex}] CAPTCHA found but could not solve automatically`);
    }

    // Step 7: Check for membership screening / rules agreement
    const screeningResult = await handleMembershipScreening(page, botIndex);

    // Step 8: Final check - wait and see if we landed in a channel
    await page.waitForTimeout(3000);
    const finalUrl = page.url();
    const inServer = finalUrl.includes('/channels/');

    // Save final screenshot
    const finalScreenshotPath = path.join(SESSIONS_DIR, `verify-bot${botIndex}-final-${Date.now()}.png`);
    await page.screenshot({ path: finalScreenshotPath, fullPage: false });

    if (inServer) {
      console.log(`✅ [Bot ${botIndex}] Successfully joined server!`);
      return { success: true, method: 'joined' };
    }

    // Step 9: If we still see an invite page, try one more time with the button
    if (!inServer) {
      console.log(`⚠️ [Bot ${botIndex}] Not in server yet, trying alternative approach...`);
      
      // Alternative: Go directly to discord.com/login, inject token, then go to invite
      await page.goto('https://discord.com/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
      await page.evaluate((t) => {
        window.localStorage.setItem('token', JSON.stringify(t));
      }, token);
      
      await page.goto(inviteUrl, { waitUntil: 'networkidle2', timeout: 60000 });
      await page.waitForTimeout(5000);
      
      // Try clicking all buttons
      try {
        const allButtons = await page.$$('button');
        for (const btn of allButtons) {
          const text = await page.evaluate(el => el.textContent.trim().toLowerCase(), btn);
          if (text && (text.includes('accept') || text.includes('join'))) {
            await btn.click();
            await page.waitForTimeout(3000);
            break;
          }
        }
      } catch (e) {}
      
      await page.waitForTimeout(3000);
      const retryUrl = page.url();
      if (retryUrl.includes('/channels/')) {
        return { success: true, method: 'joined-retry' };
      }
    }

    return { 
      success: inServer, 
      method: inServer ? 'joined' : 'failed',
      error: inServer ? undefined : 'Could not complete verification process'
    };

  } catch (error) {
    console.error(`❌ [Bot ${botIndex}] Verification solver error:`, error.message);
    return { success: false, method: 'error', error: error.message };
  } finally {
    if (browser) {
      try { await browser.close(); } catch (e) {}
    }
  }
}

/**
 * Detect and solve CAPTCHA on the page
 */
async function detectAndSolveCaptcha(page, botIndex) {
  const result = { found: false, solved: false, method: null };

  try {
    // Check for hCaptcha iframe
    const hcaptchaIframe = await page.$('iframe[src*="hcaptcha"]');
    if (hcaptchaIframe) {
      console.log(`🛡️ [Bot ${botIndex}] hCaptcha detected, attempting to solve...`);
      
      // Try to click the hCaptcha checkbox
      try {
        const frame = await hcaptchaIframe.contentFrame();
        if (frame) {
          const checkbox = await frame.$('#checkbox');
          if (checkbox) {
            await checkbox.click();
            console.log(`🖱️ [Bot ${botIndex}] Clicked hCaptcha checkbox`);
            await page.waitForTimeout(3000);
            result.solved = true;
            result.method = 'hcaptcha-checkbox';
          }
        }
      } catch (e) {
        console.log(`⚠️ [Bot ${botIndex}] hCaptcha checkbox click failed:`, e.message);
      }
      
      result.found = true;
      return result;
    }

    // Check for reCAPTCHA iframe
    const recaptchaIframe = await page.$('iframe[src*="recaptcha"]');
    if (recaptchaIframe) {
      console.log(`🛡️ [Bot ${botIndex}] reCAPTCHA detected`);
      result.found = true;
      // reCAPTCHA is hard to auto-solve, but we can try clicking
      try {
        await recaptchaIframe.click();
        await page.waitForTimeout(2000);
        result.solved = true;
        result.method = 'recaptcha-click';
      } catch (e) {}
      return result;
    }

    // Check for text-based CAPTCHA (image with text to type)
    const captchaImage = await page.$('img[class*="captcha"], img[alt*="captcha"], div[class*="captcha"] img');
    if (captchaImage) {
      console.log(`🛡️ [Bot ${botIndex}] Text CAPTCHA detected, using OCR...`);
      
      // Take screenshot of the CAPTCHA area
      const captchaBox = await captchaImage.boundingBox();
      if (captchaBox) {
        const captchaScreenshot = await page.screenshot({
          clip: {
            x: captchaBox.x,
            y: captchaBox.y,
            width: captchaBox.width,
            height: captchaBox.height
          }
        });

        // Use Tesseract.js for OCR
        const { data: { text } } = await Tesseract.recognize(
          captchaScreenshot,
          'eng',
          { logger: m => { if (m.status === 'recognizing text') console.log(`📝 [Bot ${botIndex}] OCR progress: ${Math.round(m.progress * 100)}%`); } }
        );

        const cleanedText = text.trim().replace(/\s+/g, '');
        console.log(`📝 [Bot ${botIndex}] OCR result: "${cleanedText}"`);

        if (cleanedText) {
          // Find the input field and type the solution
          const inputSelectors = [
            'input[class*="captcha"]',
            'input[placeholder*="captcha"]',
            'input[type="text"]:not([class*="search"])',
            'textarea'
          ];

          for (const selector of inputSelectors) {
            try {
              const input = await page.$(selector);
              if (input) {
                await input.click();
                await input.type(cleanedText, { delay: 50 });
                console.log(`⌨️ [Bot ${botIndex}] Typed CAPTCHA solution`);
                
                // Look for submit button
                const submitBtn = await page.$('button[type="submit"], button:has-text("Verify"), button:has-text("Submit")');
                if (submitBtn) {
                  await submitBtn.click();
                  console.log(`🖱️ [Bot ${botIndex}] Submitted CAPTCHA solution`);
                }
                
                result.solved = true;
                result.method = 'ocr';
                break;
              }
            } catch (e) {}
          }
        }
      }
      
      result.found = true;
      return result;
    }

    // Check for any visible CAPTCHA widget
    const captchaWidget = await page.$('div[class*="captcha"], div[id*="captcha"]');
    if (captchaWidget) {
      console.log(`🛡️ [Bot ${botIndex}] CAPTCHA widget detected`);
      result.found = true;
      
      // Try to find an input inside
      const input = await captchaWidget.$('input');
      if (input) {
        // Take screenshot of the widget for OCR
        const widgetBox = await captchaWidget.boundingBox();
        if (widgetBox) {
          const widgetScreenshot = await page.screenshot({
            clip: {
              x: widgetBox.x,
              y: widgetBox.y,
              width: Math.min(widgetBox.width, 800),
              height: Math.min(widgetBox.height, 600)
            }
          });

          const { data: { text } } = await Tesseract.recognize(
            widgetScreenshot,
            'eng'
          );

          const cleanedText = text.trim().replace(/\s+/g, '');
          console.log(`📝 [Bot ${botIndex}] OCR result from widget: "${cleanedText}"`);

          if (cleanedText && cleanedText.length > 2) {
            await input.click();
            await input.type(cleanedText, { delay: 30 });
            
            // Try to submit
            const submitInWidget = await captchaWidget.$('button');
            if (submitInWidget) {
              await submitInWidget.click();
            }
            
            result.solved = true;
            result.method = 'ocr-widget';
          }
        }
      }
    }

  } catch (error) {
    console.error(`❌ [Bot ${botIndex}] CAPTCHA detection error:`, error.message);
  }

  return result;
}

/**
 * Handle membership screening / rules agreement
 */
async function handleMembershipScreening(page, botIndex) {
  try {
    await page.waitForTimeout(2000);

    // Look for "Agree" or "Accept" buttons for rules
    const screeningSelectors = [
      'button:has-text("Agree")',
      'button:has-text("Accept")',
      'button:has-text("I agree")',
      'button:has-text("Continue")',
      'button:has-text("Next")',
      'button:has-text("Done")',
      'button[class*="agree"]',
      'button[class*="accept"]',
      'div[class*="agreeButton"]',
      'div[role="button"]:has-text("Agree")',
      'div[role="button"]:has-text("Accept")'
    ];

    for (const selector of screeningSelectors) {
      try {
        const elements = await page.$$(selector);
        for (const el of elements) {
          const visible = await page.evaluate(e => {
            const style = window.getComputedStyle(e);
            return style.display !== 'none' && style.visibility !== 'hidden' && e.offsetHeight > 0;
          }, el);
          
          if (visible) {
            await el.click();
            console.log(`🖱️ [Bot ${botIndex}] Clicked screening button`);
            await page.waitForTimeout(1500);
            return true;
          }
        }
      } catch (e) {}
    }

    // Check for checkbox agreements
    const checkboxes = await page.$$('input[type="checkbox"], div[class*="checkbox"]');
    for (const cb of checkboxes) {
      try {
        const isChecked = await page.evaluate(el => el.checked || el.classList.contains('checked') || el.getAttribute('aria-checked') === 'true', cb);
        if (!isChecked) {
          await cb.click();
          console.log(`🖱️ [Bot ${botIndex}] Clicked agreement checkbox`);
          await page.waitForTimeout(500);
        }
      } catch (e) {}
    }

    return false;
  } catch (error) {
    console.error(`❌ [Bot ${botIndex}] Screening handler error:`, error.message);
    return false;
  }
}

/**
 * Join a server for a single bot with full verification solving
 */
async function joinServerWithVerification(token, inviteCode, botIndex = 0) {
  console.log(`🚀 [Bot ${botIndex}] Joining server with verification solver...`);
  return await solveServerVerification(token, inviteCode, botIndex);
}

module.exports = {
  solveServerVerification,
  joinServerWithVerification,
  detectAndSolveCaptcha,
  handleMembershipScreening
};