"use client";
import { useEffect, type RefObject } from "react";
import { motion } from "@/lib/motion";
const nativeEase = "cubic-bezier(.22,.61,.36,1)";
/** Touch devices use native observers/animations, without downloading GSAP or Lenis. */
function mobileMotion(root: HTMLDivElement) {
  const animations = new Set<Animation>();
  const targets = Array.from(
    root.querySelectorAll<HTMLElement>("[data-reveal]"),
  );
  function animate(
    element: HTMLElement,
    frames: Keyframe[],
    duration = motion.long,
  ) {
    const animation = element.animate(frames, {
      duration: duration * 1000,
      easing: nativeEase,
      fill: "both",
    });
    animations.add(animation);
    animation.onfinish = () => {
      animation.cancel();
      animations.delete(animation);
    };
    return animation;
  }
  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        element.style.opacity = "1";
        animate(element, [
          { opacity: 0, transform: `translateY(${motion.distance}px)` },
          { opacity: 1, transform: "translateY(0)" },
        ]);
        reveal.unobserve(element);
      });
    },
    { rootMargin: "0px 0px -3% 0px", threshold: 0 },
  );
  targets.forEach((element) => {
    if (element.getBoundingClientRect().bottom < 0) return;
    element.style.opacity = "0";
    reveal.observe(element);
  });
  const masks = Array.from(
    root.querySelectorAll<HTMLElement>(".card-image,.editorial-photo"),
  );
  const maskObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target as HTMLElement, [
          { clipPath: "inset(8% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)" },
        ]);
        maskObserver.unobserve(entry.target);
      });
    },
    { threshold: 0 },
  );
  masks.forEach((element) => maskObserver.observe(element));
  const line = root.querySelector<HTMLElement>(".editorial-line");
  const lineObserver = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting) && line) {
      line.style.transformOrigin = "left";
      animate(line, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }]);
      lineObserver.disconnect();
    }
  });
  if (line) lineObserver.observe(line);
  const section = root.querySelector<HTMLElement>(".human-editorial"),
    image = root.querySelector<HTMLElement>(".editorial-image-inner");
  let frame = 0;
  const update = () => {
    frame = 0;
    if (!section || !image) return;
    const rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const progress = Math.max(
      -1,
      Math.min(
        1,
        (innerHeight / 2 - rect.top - rect.height / 2) /
          (innerHeight / 2 + rect.height / 2),
      ),
    );
    image.style.transform = `translate3d(0,${progress * 6}px,0)`;
  };
  const scroll = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener("scroll", scroll, { passive: true });
  update();
  return () => {
    reveal.disconnect();
    maskObserver.disconnect();
    lineObserver.disconnect();
    animations.forEach((animation) => animation.cancel());
    targets.forEach((element) => element.style.removeProperty("opacity"));
    window.removeEventListener("scroll", scroll);
    cancelAnimationFrame(frame);
    image?.style.removeProperty("transform");
    line?.style.removeProperty("transform-origin");
  };
}
export function useSiteMotion(scope: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)"),
      mobile = matchMedia("(max-width: 767px)");
    let disposed = false,
      generation = 0,
      cleanup = () => {};
    const setup = async () => {
      const ticket = ++generation;
      cleanup();
      cleanup = () => {};
      if (reduced.matches || !scope.current) return;
      if (mobile.matches) {
        cleanup = mobileMotion(scope.current);
        return;
      }
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("lenis"),
        ]);
      if (disposed || ticket !== generation || !scope.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ duration: 1, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      const context = gsap.context(() => {
        gsap.utils
          .toArray<HTMLElement>("[data-reveal]:not(.practice-card)")
          .forEach((element) =>
            gsap.fromTo(
              element,
              { y: motion.distance, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: motion.long,
                ease: motion.ease,
                scrollTrigger: {
                  trigger: element,
                  start: "top 96%",
                  once: true,
                },
              },
            ),
          );
        gsap.fromTo(
          ".practice-card",
          { opacity: 0 },
          {
            opacity: 1,
            duration: motion.medium,
            stagger: motion.stagger,
            scrollTrigger: {
              trigger: ".practice-grid",
              start: "top 96%",
              once: true,
            },
          },
        );
        gsap.utils.toArray<HTMLElement>(".practice-card").forEach((card) => {
          gsap.fromTo(
            card.querySelector(".card-body"),
            { y: motion.distance },
            {
              y: 0,
              duration: motion.long,
              ease: motion.ease,
              scrollTrigger: { trigger: card, start: "top 96%", once: true },
            },
          );
          gsap.fromTo(
            card.querySelector(".card-image"),
            { clipPath: "inset(8% 0 0 0)" },
            {
              clipPath: "inset(0% 0 0 0)",
              duration: motion.long,
              ease: motion.ease,
              scrollTrigger: { trigger: card, start: "top 96%", once: true },
            },
          );
        });
        gsap.fromTo(
          ".hero-portrait",
          { y: motion.distance },
          { y: 0, duration: motion.long, ease: motion.ease },
        );
        gsap.to(".hero-portrait-photo", {
          yPercent: 2,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.fromTo(
          ".editorial-image-inner",
          { x: -8, y: -12 },
          {
            x: 8,
            y: 12,
            ease: "none",
            scrollTrigger: {
              trigger: ".human-editorial",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
        gsap.fromTo(
          ".editorial-photo",
          { clipPath: "inset(8% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: motion.long,
            ease: motion.ease,
            scrollTrigger: {
              trigger: ".editorial-photo",
              start: "top 96%",
              once: true,
            },
          },
        );
        gsap.fromTo(
          ".editorial-line",
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1,
            duration: motion.long,
            ease: motion.ease,
            scrollTrigger: {
              trigger: ".human-editorial",
              start: "top 85%",
              once: true,
            },
          },
        );
      }, scope);
      let active = true;
      const refresh = () => {
        if (active) ScrollTrigger.refresh();
      };
      const images = Array.from(scope.current.querySelectorAll("img"));
      images.forEach((image) => {
        if (!image.complete) {
          image.addEventListener("load", refresh);
          image.addEventListener("error", refresh);
        }
      });
      document.fonts.ready.then(refresh);
      window.addEventListener("load", refresh, { once: true });
      refresh();
      cleanup = () => {
        active = false;
        images.forEach((image) => {
          image.removeEventListener("load", refresh);
          image.removeEventListener("error", refresh);
        });
        window.removeEventListener("load", refresh);
        context.revert();
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    };
    const change = () => {
      void setup();
    };
    change();
    reduced.addEventListener("change", change);
    mobile.addEventListener("change", change);
    return () => {
      disposed = true;
      generation++;
      cleanup();
      reduced.removeEventListener("change", change);
      mobile.removeEventListener("change", change);
    };
  }, [scope]);
}
