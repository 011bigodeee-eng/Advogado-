const { chromium } = require("@playwright/test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const base = process.env.TEST_URL || "http://127.0.0.1:3000";
const general =
  "Olá, Dr. Osmar Malta! Acessei seu site e gostaria de saber como funciona o atendimento jurídico. Poderia me passar mais informações?";
const messages = [
  "Olá, Dr. Osmar Malta! Acessei seu site e gostaria de informações sobre atendimento na área de Direito de Família.",
  "Olá, Dr. Osmar Malta! Gostaria de obter informações sobre orientação jurídica relacionada a inventários.",
  "Olá, Dr. Osmar Malta! Acessei seu site e gostaria de informações sobre atendimento na área de Execução Penal.",
];
function checkWhatsApp(href, message) {
  const url = new URL(href);
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/5521988049390");
  assert.equal(url.searchParams.get("text"), message);
}
async function editorialLayout(page, width) {
  const copy = await page.locator(".editorial-copy").boundingBox(),
    photo = await page.locator(".editorial-photo").boundingBox();
  assert(
    copy.x + copy.width <= photo.x + 1 || copy.y + copy.height <= photo.y + 1,
    `Editorial copy/photo collision at ${width}px`,
  );
  const figure = await page.locator(".editorial-figure").boundingBox(),
    section = await page.locator(".human-editorial").boundingBox();
  assert(
    figure.x >= section.x - 1 &&
      figure.x + figure.width <= section.x + section.width + 1,
    `Editorial outside section at ${width}px`,
  );
  assert.equal(
    await page
      .locator(".editorial-photo")
      .evaluate((e) => getComputedStyle(e).rotate),
    "none",
  );
}
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
  const errors = [],
    failed = [];
  function record(page) {
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
    });
  }
  async function localContext(options) {
    const context = await browser.newContext(options);
    await context.route("https://wa.me/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<title>WhatsApp link intercepted locally</title>",
      }),
    );
    return context;
  }
  try {
    const context = await localContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    record(page);
    await page.addInitScript(() => {
      window.__opened = [];
      window.open = (url, target, features) => {
        window.__opened.push({ url, target, features });
        return null;
      };
    });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    for (const width of [320, 360, 375, 390, 430, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      for (const id of [
        "inicio",
        "escritorio",
        "atuacao",
        "perspectiva",
        "diferenciais",
        "perguntas",
        "contato",
      ]) {
        await page
          .locator(`#${id}`)
          .evaluate((e) =>
            e.scrollIntoView({ block: "start", behavior: "instant" }),
          );
        await page.waitForTimeout(60);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth + 1,
          ),
          false,
          `Overflow: ${width}px #${id}`,
        );
      }
      const fits = await page.locator(".hero-name").evaluate((e) => {
        const outer = e.getBoundingClientRect();
        return [...e.querySelectorAll(".hero-prefix,.hero-surname")].every(
          (span) => {
            const r = document.createRange();
            r.selectNodeContents(span);
            const t = r.getBoundingClientRect();
            return t.left >= outer.left - 1 && t.right <= outer.right + 1;
          },
        );
      });
      assert(fits, `Clipped name: ${width}px`);
      const copy = await page.locator(".hero-content").boundingBox(),
        portrait = await page.locator(".hero-portrait").boundingBox();
      assert(
        copy.x + copy.width <= portrait.x + 1 ||
          copy.y + copy.height <= portrait.y + 1,
        `Hero collision ${width}px`,
      );
      await editorialLayout(page, width);
      const cards = await page
        .locator(".practice-card")
        .evaluateAll((nodes) =>
          nodes.map((node) => node.getBoundingClientRect().height),
        );
      if (width >= 1024)
        assert(
          Math.max(...cards) - Math.min(...cards) <= 1,
          `Unequal cards at ${width}px`,
        );
      await page.waitForTimeout(150);
      assert.equal(
        await page.locator(".whatsapp-float").count(),
        0,
        "Floating WhatsApp must hide near the contact form",
      );
      if ([390, 768, 1440].includes(width)) {
        await page.evaluate(() => scrollTo(0, 0));
        await page.waitForTimeout(150);
        await page.screenshot({ path: `/tmp/osmar-audit-${width}.png` });
        await page
          .locator("#perspectiva")
          .evaluate((e) =>
            e.scrollIntoView({ block: "start", behavior: "instant" }),
          );
        await page.waitForTimeout(200);
        await page.screenshot({ path: `/tmp/osmar-editorial-${width}.png` });
      }
      console.log(
        `PASS ${width}px: layout, editorial separation, name and card sizing`,
      );
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(200);
    assert(await page.locator(".whatsapp-float").isVisible());
    checkWhatsApp(
      await page.locator(".whatsapp-float").getAttribute("href"),
      general,
    );
    await page.getByRole("button", { name: "Abrir menu" }).click();
    assert(
      await page.getByRole("dialog", { name: "Menu de navegação" }).isVisible(),
    );
    assert.equal(await page.locator(".whatsapp-float").count(), 0);
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
    console.log("PASS mobile menu, keyboard and floating-button visibility");
    const expectedImages = [
      "/images/direito-familia.png",
      "/images/inventarios.png",
      "/images/execucao-penal.png",
    ];
    for (let index = 0; index < 3; index++) {
      const card = page.locator(".practice-card").nth(index);
      checkWhatsApp(await card.getAttribute("href"), messages[index]);
      assert(
        (await card.locator("img").getAttribute("src")).includes(
          encodeURIComponent(expectedImages[index]),
        ),
      );
      const popupEvent = context.waitForEvent("page");
      await card.click();
      const popup = await popupEvent;
      await popup.waitForLoadState("domcontentloaded");
      checkWhatsApp(popup.url(), messages[index]);
      assert.equal(await popup.title(), "WhatsApp link intercepted locally");
      await popup.close();
    }
    console.log(
      "PASS all three area-specific WhatsApp messages and local-only popup navigation",
    );
    const faq = page.locator("details").first();
    await faq.locator("summary").click();
    assert((await faq.getAttribute("open")) !== null);
    await faq.locator("summary").press("Enter");
    assert.equal(await faq.getAttribute("open"), null);
    await page.locator(".consent button").click();
    assert(await page.locator("dialog").isVisible());
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog").isVisible(), false);
    console.log("PASS FAQ and privacy keyboard interactions");
    checkWhatsApp(
      await page.locator(".contact-whatsapp").getAttribute("href"),
      general,
    );
    checkWhatsApp(
      await page.locator(".header-cta").getAttribute("href"),
      general,
    );
    assert.equal(
      await page.locator(".contact-instagram").getAttribute("href"),
      "https://www.instagram.com/osmarmaltaadvogado/",
    );
    assert.equal(
      await page.locator(".form-email-alternative").getAttribute("href"),
      "mailto:maltaemachadoadv@gmail.com",
    );
    assert.equal(
      await page.locator("form").evaluate((f) => f.checkValidity()),
      false,
    );
    await page.locator('[name="nome"]').fill("  ");
    await page.locator('[name="contato"]').fill("invalido");
    await page.locator('[name="assunto"]').selectOption("Inventários");
    await page.locator('[name="mensagem"]').fill("   ");
    await page.locator(".consent input").check();
    await page.getByRole("button", { name: "Continuar pelo WhatsApp" }).click();
    assert.equal(await page.evaluate(() => window.__opened.length), 0);
    assert(
      await page
        .locator('[name="nome"]')
        .evaluate((e) => Boolean(e.validationMessage)),
    );
    await page.locator('[name="nome"]').fill("Pessoa de teste");
    await page.locator('[name="contato"]').fill("teste@example.com");
    const message =
      "Preciso de orientação sobre inventários & documentação? Sem dados sensíveis.";
    await page.locator('[name="mensagem"]').fill(message);
    await page.locator(".consent input").uncheck();
    await page.getByRole("button", { name: "Continuar pelo WhatsApp" }).click();
    assert.equal(await page.evaluate(() => window.__opened.length), 0);
    await page.locator(".consent input").check();
    await page.getByRole("button", { name: "Continuar pelo WhatsApp" }).click();
    const opened = await page.evaluate(() => window.__opened);
    assert.equal(opened.length, 1);
    checkWhatsApp(
      opened[0].url,
      `Olá, Dr. Osmar Malta!\n\nMeu nome é Pessoa de teste.\n\nGostaria de informações sobre Inventários.\n\nMensagem: ${message}\n\nMeu contato: teste@example.com.`,
    );
    assert.equal(opened[0].features, "noopener,noreferrer");
    assert.equal(
      await page.locator(".form-prepared a").getAttribute("href"),
      opened[0].url,
    );
    assert(await page.locator(".form-prepared").isVisible());
    assert.equal(
      await page.evaluate(() => localStorage.length + sessionStorage.length),
      0,
    );
    await page.locator('[name="mensagem"]').fill("Outra demanda");
    assert.equal(await page.locator(".form-prepared").count(), 0);
    console.log(
      "PASS form validation, consent, encoded WhatsApp message and fallback; no external data sent",
    );
    await page
      .locator(".site-footer")
      .evaluate((e) => e.scrollIntoView({ block: "end", behavior: "instant" }));
    await page.waitForTimeout(150);
    assert.equal(await page.locator(".whatsapp-float").count(), 0);
    await page.setViewportSize({ width: 844, height: 390 });
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.locator("#mobile-navigation a").last().click();
    assert.equal(await page.locator("#mobile-navigation").count(), 0);
    console.log(
      "PASS landscape menu and footer without floating-button obstruction",
    );
    for (
      let y = 0;
      y < (await page.evaluate(() => document.body.scrollHeight));
      y += 650
    ) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(50);
    }
    await page.waitForTimeout(900);
    assert.deepEqual(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images
            .filter(
              (i) =>
                !i.closest(".cursor-reveal") &&
                (!i.complete || !i.naturalWidth),
            )
            .map((i) => i.src),
        ),
      [],
    );
    await context.close();
    // Test actual scroll motion, image masks and hover without reduced-motion overrides.
    const motion = await localContext({
      viewport: { width: 1440, height: 1000 },
    });
    const desktop = await motion.newPage();
    record(desktop);
    await desktop.goto(base, { waitUntil: "networkidle" });
    await desktop.waitForTimeout(2200);
    assert.equal(await desktop.locator(".intro").count(), 0);
    await desktop.screenshot({ path: "/tmp/osmar-desktop.png" });
    await desktop
      .locator("#perspectiva")
      .evaluate((e) =>
        e.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    await desktop.waitForTimeout(1200);
    await editorialLayout(desktop, 1440);
    assert.equal(await desktop.locator(".diagonal-track").count(), 0);
    const displacement = await desktop
      .locator(".editorial-image-inner")
      .evaluate((e) => {
        const m = new DOMMatrix(getComputedStyle(e).transform);
        return {
          x: m.m41,
          y: m.m42,
          rotation: (Math.atan2(m.b, m.a) * 180) / Math.PI,
        };
      });
    assert(
      Math.abs(displacement.x) <= 9 &&
        Math.abs(displacement.y) <= 13 &&
        Math.abs(displacement.rotation) < 0.1,
    );
    assert(
      (
        await desktop
          .locator(".editorial-liquid")
          .evaluate((e) => getComputedStyle(e).filter)
      ).includes("liquid"),
    );
    await desktop.screenshot({ path: "/tmp/osmar-editorial-motion.png" });
    const card = desktop.locator(".practice-card").first();
    await card.scrollIntoViewIfNeeded();
    await desktop.waitForTimeout(1000);
    const box = await card.boundingBox();
    await desktop.mouse.move(box.x + box.width - 5, box.y + box.height / 2);
    await desktop.waitForTimeout(400);
    assert(
      Math.abs(
        await card.evaluate((e) =>
          parseFloat(e.style.getPropertyValue("--tilt")),
        ),
      ) <= 3,
    );
    const actual = await card.evaluate((e) => getComputedStyle(e).transform);
    assert.notEqual(actual, "none");
    const scale = await card
      .locator("img")
      .evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).a);
    assert(scale <= 1.041);
    console.log(
      "PASS masked diagonal movement, liquid layer, live 3D hover and scale limit",
    );
    await desktop.locator("#diferenciais").scrollIntoViewIfNeeded();
    await desktop.waitForTimeout(1000);
    assert(
      (await desktop.locator(".sculpture-fallback,.sculpture canvas").count()) >
        0,
    );
    for (
      let y = 0;
      y < (await desktop.evaluate(() => document.body.scrollHeight));
      y += 650
    ) {
      await desktop.evaluate((y) => scrollTo(0, y), y);
      await desktop.waitForTimeout(80);
    }
    await desktop.waitForTimeout(1000);
    assert.equal(
      await desktop
        .locator("[data-reveal]")
        .evaluateAll(
          (nodes) =>
            nodes.filter(
              (node) => Number(getComputedStyle(node).opacity) < 0.95,
            ).length,
        ),
      0,
    );
    await desktop.evaluate(() => scrollTo(0, 0));
    await desktop.waitForTimeout(150);
    await desktop.screenshot({ path: "/tmp/osmar-full.png", fullPage: true });
    const revealRow = desktop.locator(".value-row").first();
    await revealRow.hover();
    await revealRow
      .locator(".cursor-reveal img")
      .evaluate((image) => image.decode());
    assert(
      await revealRow
        .locator(".cursor-reveal img")
        .evaluate((image) => image.naturalWidth > 0),
    );
    assert.equal(
      await desktop.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      ),
      false,
    );
    console.log("PASS optimized cursor image and no pointer-reveal overflow");
    await motion.close();
    console.log(
      "PASS sculpture/fallback and every reveal after fast scrolling",
    );
    const touch = await localContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const mobile = await touch.newPage();
    record(mobile);
    await mobile.goto(base, { waitUntil: "networkidle" });
    await mobile.waitForTimeout(2100);
    for (
      let y = 0;
      y < (await mobile.evaluate(() => document.body.scrollHeight));
      y += 500
    ) {
      await mobile.evaluate((y) => scrollTo(0, y), y);
      await mobile.waitForTimeout(80);
    }
    await mobile.waitForTimeout(1000);
    assert.equal(
      await mobile
        .locator("[data-reveal]")
        .evaluateAll(
          (nodes) =>
            nodes.filter(
              (node) => Number(getComputedStyle(node).opacity) < 0.95,
            ).length,
        ),
      0,
    );
    await editorialLayout(mobile, 390);
    assert.equal(
      await mobile
        .locator(".editorial-liquid")
        .evaluate((e) => getComputedStyle(e).filter),
      "none",
    );
    assert.equal(await mobile.locator(".sculpture canvas").count(), 0);
    const touchPopup = touch.waitForEvent("page");
    await mobile.locator(".practice-card").first().tap();
    const popup = await touchPopup;
    await popup.waitForLoadState("domcontentloaded");
    checkWhatsApp(popup.url(), messages[0]);
    await popup.close();
    await touch.close();
    console.log(
      "PASS mobile motion, light liquid fallback, static depth and touch WhatsApp CTA",
    );
    assert.deepEqual(errors, []);
    assert.deepEqual(failed, []);
    console.log("PASS no JavaScript or HTTP errors");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
