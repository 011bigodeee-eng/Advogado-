const { chromium } = require("@playwright/test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_PATH
      ? { executablePath: process.env.CHROMIUM_PATH }
      : fs.existsSync("/usr/bin/chromium")
        ? { executablePath: "/usr/bin/chromium" }
        : {}),
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const failed = [];
    page.on("response", (r) => {
      if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
    });
    await page.goto(process.env.TEST_URL || "http://127.0.0.1:3000", {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);
    for (const width of [320, 360, 375, 390, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const id of [
        "inicio",
        "escritorio",
        "atuacao",
        "diferenciais",
        "perguntas",
        "contato",
      ]) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        await page.waitForTimeout(80);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        );
        assert.equal(
          overflow,
          false,
          `Horizontal overflow: ${width}px, #${id}`,
        );
      }
      console.log(`PASS layout ${width}px`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(process.env.TEST_URL || "http://127.0.0.1:3000");
    await page.getByRole("button", { name: "Abrir menu" }).click();
    assert(
      await page.getByRole("dialog", { name: "Menu de navegação" }).isVisible(),
    );
    await page.keyboard.press("Escape");
    assert.equal(
      await page
        .getByRole("button", { name: "Abrir menu" })
        .getAttribute("aria-expanded"),
      "false",
    );
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.locator('#mobile-navigation a[href="#atuacao"]').click();
    assert.equal(await page.locator("#mobile-navigation").count(), 0);
    console.log("PASS mobile menu, keyboard Escape and anchor");
    const faq = page.locator("details").first();
    await faq.locator("summary").click();
    assert((await faq.getAttribute("open")) !== null);
    assert(await faq.locator(".faq-answer").isVisible());
    await faq.locator("summary").press("Enter");
    assert.equal(await faq.getAttribute("open"), null);
    console.log("PASS FAQ mouse and keyboard");
    await page.locator(".consent button").click();
    assert(await page.locator("dialog").isVisible());
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog").isVisible(), false);
    console.log("PASS privacy modal and keyboard close");
    assert.equal(
      await page.locator("form").evaluate((f) => f.checkValidity()),
      false,
    );
    await page.locator('[name="nome"]').fill("Pessoa de teste");
    await page.locator('[name="contato"]').fill("teste@example.com");
    await page.locator('[name="assunto"]').selectOption("Inventários");
    await page
      .locator('[name="mensagem"]')
      .fill("Mensagem fictícia para validar o formulário.");
    assert.equal(
      await page.locator("form").evaluate((f) => f.checkValidity()),
      false,
    );
    await page.locator(".consent input").check();
    assert.equal(
      await page.locator("form").evaluate((f) => f.checkValidity()),
      true,
    );
    assert.equal(
      await page.locator(".contact-email").getAttribute("href"),
      "mailto:maltaemachadoadv@gmail.com",
    );
    assert.equal(await page.locator('.contact-whatsapp').getAttribute('href'), 'https://wa.me/5521988049390');
    assert.equal(await page.locator('.contact-instagram').getAttribute('href'), 'https://www.instagram.com/osmarmaltaadvogado/');
    console.log("PASS consent, form validation and verified contact");
    await page.locator("#inicio").scrollIntoViewIfNeeded();
    await page.screenshot({ path: "/tmp/osmar-mobile.png" });
    for (
      let y = 0;
      y < (await page.evaluate(() => document.body.scrollHeight));
      y += 700
    ) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(50);
    }
    await page.waitForTimeout(1500);
    const broken = await page
      .locator("img")
      .evaluateAll((imgs) =>
        imgs.filter((i) => !i.complete || !i.naturalWidth).map((i) => i.src),
      );
    assert.deepEqual(broken, []);
    assert.deepEqual(errors, []);
    assert.deepEqual(failed, []);
    console.log("PASS all images loaded; no HTTP or JavaScript errors");
    await page.setViewportSize({ width: 844, height: 390 });
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.locator("#mobile-navigation a").last().click();
    assert.equal(await page.locator("#mobile-navigation").count(), 0);
    console.log("PASS landscape menu");
    await context.close();
    const motion = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });
    const desktop = await motion.newPage();
    await desktop.goto(process.env.TEST_URL || "http://127.0.0.1:3000", {
      waitUntil: "networkidle",
    });
    await desktop.waitForTimeout(2600);
    assert.equal(await desktop.locator(".intro").count(), 0);
    await desktop.screenshot({ path: "/tmp/osmar-desktop.png" });
    await desktop.locator("#diferenciais").scrollIntoViewIfNeeded();
    await desktop.waitForTimeout(1200);
    assert(
      (await desktop
        .locator(".sculpture-fallback, .sculpture canvas")
        .count()) > 0,
    );
    console.log("PASS cinematic intro and sculpture/fallback");
    for (let y = 0; y < await desktop.evaluate(() => document.body.scrollHeight); y += 650) {
      await desktop.evaluate(y => scrollTo(0, y), y);
      await desktop.waitForTimeout(90);
    }
    await desktop.waitForTimeout(1000);
    const unrevealed = await desktop.locator('[data-reveal]').evaluateAll(nodes => nodes.filter(node => Number(getComputedStyle(node).opacity) < 0.95).map(node => node.className));
    assert.deepEqual(unrevealed, []);
    console.log('PASS every scroll reveal, including rapid scrolling');
    await desktop.evaluate(() => scrollTo(0, 0));
    await desktop.screenshot({ path: "/tmp/osmar-full.png", fullPage: true });
    await motion.close();
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
