"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import PracticeCard from "@/components/PracticeCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { areas, faqs, office } from "@/lib/content";
const Sculpture = dynamic(() => import("@/components/Sculpture"), {
  ssr: false,
});
const nav = [
  ["Início", "inicio"],
  ["Escritório", "escritorio"],
  ["Áreas de atuação", "atuacao"],
  ["Diferenciais", "diferenciais"],
  ["Perguntas frequentes", "perguntas"],
  ["Contato", "contato"],
];
function Arrow() {
  return (
    <svg
      aria-hidden="true"
      className="arrow"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span />
      {children}
    </p>
  );
}
export default function Home() {
  const [intro, setIntro] = useState(true),
    [menu, setMenu] = useState(false),
    [scrolled, setScrolled] = useState(false),
    [privacy, setPrivacy] = useState(false),
    [artVisible, setArtVisible] = useState(false);
  const main = useRef<HTMLDivElement>(null),
    menuButton = useRef<HTMLButtonElement>(null),
    dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => setIntro(false), 2200);
    const scroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) setIntro(false);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", scroll);
    };
  }, []);
  useEffect(() => {
    if (!menu) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const root = document.getElementById("mobile-navigation");
    const links = root?.querySelectorAll<HTMLElement>("a,button");
    links?.[0]?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
      if (e.key === "Tab" && links) {
        const first = links[0],
          last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
      menuButton.current?.focus();
    };
  }, [menu]);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    let lenis: Lenis | undefined;
    let tick: ((time: number) => void) | undefined;
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      lenis = new Lenis({ duration: 1.05, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      const ctx = gsap.context(() => {
        gsap.utils
          .toArray<HTMLElement>("[data-reveal]:not(.practice-card)")
          .forEach((el) => {
            gsap.fromTo(
              el,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 94%", once: true },
              },
            );
          });
        gsap.fromTo(
          ".practice-card",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.16,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".practice-grid",
              start: "top 90%",
              once: true,
            },
          },
        );
        gsap.utils.toArray<HTMLElement>(".card-image").forEach((image) =>
          gsap.fromTo(
            image,
            { clipPath: "inset(12% 0 0 0)" },
            {
              clipPath: "inset(0% 0 0 0)",
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: { trigger: image, start: "top 94%", once: true },
            },
          ),
        );
        gsap.fromTo(
          ".hero-portrait",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.2, delay: 1.8, ease: "power2.out" },
        );
        gsap.to(".hero-portrait-photo", {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".diagonal-track", {
          xPercent: matchMedia("(max-width: 767px)").matches ? -6 : -15,
          y: 35,
          rotate: -2,
          ease: "none",
          scrollTrigger: {
            trigger: ".visual-interlude",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.to(".liquid-architecture img", {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: ".visual-interlude",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }, main);
      return () => {
        ctx.revert();
        if (tick) gsap.ticker.remove(tick);
        lenis?.destroy();
      };
    });
    return () => mm.revert();
  }, []);
  useEffect(() => {
    const element = document.querySelector(".values-art");
    if (!element) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArtVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "250px" },
    );
    io.observe(element);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (privacy) dialog.current?.showModal();
    else dialog.current?.close();
  }, [privacy]);
  const hover = (e: React.PointerEvent<HTMLElement>) => {
    if (
      e.pointerType !== "mouse" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    e.currentTarget.style.setProperty(
      "--magx",
      `${((e.clientX - r.left) / r.width - 0.5) * 7}px`,
    );
    e.currentTarget.style.setProperty(
      "--magy",
      `${((e.clientY - r.top) / r.height - 0.5) * 7}px`,
    );
    e.currentTarget.style.setProperty(
      "--tilt",
      `${((e.clientX - r.left) / r.width - 0.5) * 3}deg`,
    );
  };
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = `Contato — ${data.get("assunto")}`;
    const body = `Nome: ${data.get("nome")}\nContato: ${data.get("contato")}\n\n${data.get("mensagem")}`;
    window.location.href = `mailto:${office.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <div ref={main}>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      {intro && (
        <div className="intro">
          <div>
            <span>OSMAR MALTA</span>
            <i />
            <small>ADVOCACIA</small>
          </div>
          <button onClick={() => setIntro(false)}>Pular abertura ↗</button>
        </div>
      )}
      <header className={scrolled ? "site-header solid" : "site-header"}>
        <a className="wordmark" href="#inicio">
          OSMAR MALTA<small>ADVOCACIA</small>
        </a>
        <nav aria-label="Navegação principal">
          {nav.slice(1, 5).map(([label, id]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#contato">
          Agendar atendimento <Arrow />
        </a>
        <button
          ref={menuButton}
          className="menu-toggle"
          onClick={() => setMenu(true)}
          aria-label="Abrir menu"
          aria-expanded={menu}
          aria-controls="mobile-navigation"
        >
          <span />
          <span />
        </button>
      </header>
      {menu && (
        <div
          id="mobile-navigation"
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          <button
            onClick={() => setMenu(false)}
            className="close-menu"
            aria-label="Fechar menu"
          >
            Fechar ×
          </button>
          <span className="eyebrow">OSMAR MALTA / ADVOCACIA</span>
          {nav.map(([label, id], i) => (
            <a onClick={() => setMenu(false)} key={id} href={`#${id}`}>
              <small>0{i + 1}</small>
              {label}
              <Arrow />
            </a>
          ))}
          <p>Rio de Janeiro · RJ</p>
        </div>
      )}
      <main id="conteudo">
        <section className="hero" id="inicio" onPointerMove={hover}>
          <div className="hero-atmosphere" aria-hidden="true">
            <div className="hero-orbit" />
            <span className="hero-axis" />
          </div>
          <div className="hero-portrait">
            <div className="portrait-frame">
              <Image
                className="hero-portrait-photo"
                src="/images/retrato-abertura.png"
                alt="Retrato fornecido para a apresentação de Dr. Osmar Malta"
                fill
                preload
                sizes="(max-width: 767px) 88vw, 40vw"
              />
              <span className="portrait-corner" aria-hidden="true" />
            </div>
            <div className="portrait-credit">
              <span>DR. OSMAR MALTA</span>
              <span>ADVOCACIA · RIO DE JANEIRO</span>
            </div>
          </div>
          <div className="hero-content">
            <Eyebrow>ADVOCACIA · RIO DE JANEIRO</Eyebrow>
            <p className="hero-name">
              <span className="hero-prefix">DR. OSMAR</span>
              <span className="hero-surname">MALTA</span>
              <span className="name-rule" aria-hidden="true" />
            </p>
            <h1>
              <span className="hero-line">Compromisso com o Direito.</span>
              <span className="hero-line">
                <em>Respeito à sua história.</em>
              </span>
            </h1>
            <div className="hero-bottom">
              <p>
                Atuação em Direito de Família, Inventários e Execução Penal, com
                atenção às particularidades de cada situação.
              </p>
              <a
                className="button primary"
                onPointerMove={hover}
                onPointerLeave={(e) => {
                  e.currentTarget.style.setProperty("--magx", "0px");
                  e.currentTarget.style.setProperty("--magy", "0px");
                }}
                href="#atuacao"
              >
                Conheça as áreas de atuação <Arrow />
              </a>
              <a className="text-link" href="#contato">
                Entre em contato <Arrow />
              </a>
            </div>
          </div>
          <div className="hero-caption">
            <span>
              ATENÇÃO À SUA HISTÓRIA.
              <br />
              RESPONSABILIDADE COM O SEU CAMINHO.
            </span>
            <a href="#escritorio" className="scroll-cue">
              EXPLORE <span>↓</span>
            </a>
            <span className="hero-index">01 — 06</span>
          </div>
        </section>
        <div className="location-band">
          <span>ADVOCACIA COM ATENÇÃO ÀS PESSOAS</span>
          <span>
            RIO DE JANEIRO <i /> CENTRO · DEL CASTILHO · SANTA CRUZ
          </span>
        </div>
        <section className="manifesto section" id="escritorio">
          <div className="section-label">
            <span>01 / O ESCRITÓRIO</span>
            <span>ESCUTA. CLAREZA. RESPONSABILIDADE.</span>
          </div>
          <div className="manifesto-grid">
            <div className="manifesto-photo professional-portrait" data-reveal>
              <svg className="filter-svg" aria-hidden="true">
                <defs>
                  <filter id="liquid">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency=".008 .018"
                      numOctaves="1"
                      seed="4"
                    >
                      <animate
                        attributeName="baseFrequency"
                        dur="16s"
                        values=".008 .018;.012 .012;.008 .018"
                        repeatCount="indefinite"
                      />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale="5" />
                  </filter>
                </defs>
              </svg>
              <Image
                className="profile-image"
                src="/images/retrato-apresentacao.png"
                alt="Retrato enviado para a apresentação profissional, em terno preto e gravata azul"
                fill
                sizes="(max-width: 767px) 100vw, 44vw"
              />
              <div className="photo-note">
                PERSPECTIVA, CUIDADO E PROPÓSITO.<span>OM.</span>
              </div>
            </div>
            <div className="manifesto-copy" data-reveal>
              <Eyebrow>UM OLHAR ATENTO PARA CADA SITUAÇÃO</Eyebrow>
              <h2>
                Cada história
                <br />
                exige atenção.
                <br />
                <em>
                  Cada decisão exige
                  <br />
                  responsabilidade.
                </em>
              </h2>
              <p>
                O Direito faz parte de momentos importantes da vida. Por isso,
                compreender o contexto de cada demanda é o ponto de partida para
                uma orientação jurídica responsável.
              </p>
              <p>
                Dr. Osmar Malta atua em Direito de Família, Inventários e
                Execução Penal, com uma abordagem institucional pautada na
                clareza das informações e no respeito às particularidades de
                cada situação.
              </p>
              <a className="text-link" href="#contato">
                Conheça os próximos passos <Arrow />
              </a>
              <div className="signature">
                Osmar Malta <span>ADVOGADO</span>
              </div>
            </div>
          </div>
        </section>
        <section className="practice section" id="atuacao">
          <div className="section-label">
            <span>02 / ÁREAS DE ATUAÇÃO</span>
            <span>ORIENTAÇÃO PARA DIFERENTES MOMENTOS.</span>
          </div>
          <div className="section-heading" data-reveal>
            <h2>
              O cuidado muda.
              <br />
              <em>A responsabilidade permanece.</em>
            </h2>
            <p>
              Três frentes de atuação.
              <br />
              Um olhar individual para cada demanda.
            </p>
          </div>
          <div className="practice-grid">
            {areas.map((area) => (
              <PracticeCard key={area.number} area={area} />
            ))}
          </div>
        </section>
        <section
          className="visual-interlude"
          aria-label="Uma perspectiva mais humana"
        >
          <div className="diagonal-track">
            <div className="interlude-image liquid-architecture">
              <Image
                src="/images/execucao-penal.png"
                alt="Cena ilustrativa de análise processual em ambiente jurídico brasileiro"
                fill
                sizes="60vw"
              />
            </div>
            <p>
              Além dos processos,
              <br />
              <em>existem pessoas.</em>
            </p>
            <div className="interlude-image second">
              <Image
                src="/images/direito-familia.png"
                alt="Cena ilustrativa de consulta jurídica familiar com adultos"
                fill
                sizes="40vw"
              />
            </div>
          </div>
          <span className="interlude-note">
            DIREITO, COM PERSPECTIVA HUMANA.
          </span>
        </section>
        <section className="values section" id="diferenciais">
          <div className="section-label">
            <span>03 / PRINCÍPIOS DE ATUAÇÃO</span>
            <span>O ESSENCIAL CONDUZ CADA PASSO.</span>
          </div>
          <div className="values-grid">
            <div className="values-art" data-reveal>
              <Eyebrow>EQUILÍBRIO ENTRE RAZÃO E CUIDADO</Eyebrow>
              <h2>
                Clareza para compreender.
                <br />
                <em>Cuidado para orientar.</em>
              </h2>
              {artVisible ? (
                <Sculpture />
              ) : (
                <div className="sculpture" aria-hidden="true">
                  <div className="sculpture-fallback">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <i
                        key={i}
                        style={{
                          transform: `rotate(${i * 32}deg) rotateY(${i * 20}deg)`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <span className="art-caption">
                FORMA, EQUILÍBRIO E PERSPECTIVA — ESTUDO VISUAL
              </span>
            </div>
            <div className="values-list">
              {[
                [
                  "Comunicação clara",
                  "Informações compreensíveis para uma visão consciente sobre a situação jurídica.",
                ],
                [
                  "Atenção individualizada",
                  "Cada demanda tem um contexto próprio e merece ser compreendida em sua singularidade.",
                ],
                [
                  "Orientação responsável",
                  "Análise cuidadosa para apresentar possibilidades jurídicas, sem promessas de resultados.",
                ],
                [
                  "Respeito às questões sensíveis",
                  "Discrição e cuidado no tratamento de assuntos que envolvem pessoas, famílias e direitos.",
                ],
              ].map(([title, text], i) => (
                <div
                  className="value-row"
                  key={title}
                  onPointerMove={hover}
                  data-reveal
                >
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                  <span className="value-cross">+</span>
                  <span
                    className="cursor-reveal"
                    aria-hidden="true"
                    style={{ backgroundImage: `url(${areas[i % 3].image})` }}
                  />
                </div>
              ))}
              <p className="small-note">
                Princípios propostos para esta apresentação institucional,
                sujeitos à validação do advogado.
              </p>
            </div>
          </div>
        </section>
        <section
          className="story-section section"
          aria-label="Atenção em cada etapa"
        >
          <div className="story-panel story-one">
            <div className="story-portrait">
              <Image
                src="/images/retrato-atendimento.png"
                alt="Retrato enviado para a seção de atendimento, à mesa em ambiente profissional"
                fill
                sizes="(max-width: 767px) 88vw, 50vw"
              />
            </div>
            <div className="story-caption">
              <span className="eyebrow">01 — COMPREENDER</span>
              <h2>
                Antes de orientar,
                <br />
                <em>é preciso ouvir.</em>
              </h2>
              <p>Uma história é mais do que os documentos que a acompanham.</p>
            </div>
          </div>
          <div className="story-panel story-two">
            <span className="eyebrow">02 — ORIENTAR</span>
            <h2>
              Informação clara.
              <br />
              <em>Decisões conscientes.</em>
            </h2>
            <p>Compreender os próximos passos é parte essencial do caminho.</p>
            <a className="text-link" href="#contato">
              Vamos iniciar uma conversa <Arrow />
            </a>
          </div>
        </section>
        <section className="process section">
          <div className="section-label">
            <span>04 / PRIMEIROS PASSOS</span>
            <span>UMA CONVERSA DE CADA VEZ.</span>
          </div>
          <div className="section-heading" data-reveal>
            <h2>
              Um caminho que começa
              <br />
              <em>com a sua história.</em>
            </h2>
            <p>
              Fluxo ilustrativo de atendimento.
              <br />
              Etapas sujeitas à confirmação do advogado.
            </p>
          </div>
          <div className="process-grid">
            {[
              [
                "Primeiro contato",
                "Apresente o assunto de forma breve, sem compartilhar informações sensíveis.",
              ],
              [
                "Compreensão da demanda",
                "O contexto é apresentado para avaliação da possibilidade de atuação.",
              ],
              [
                "Orientação sobre os próximos passos",
                "As etapas seguintes são definidas conforme a análise da situação.",
              ],
            ].map(([title, text], i) => (
              <div key={title} className="process-step" data-reveal>
                <div>
                  <span>0{i + 1}</span>
                  <i />
                  <Arrow />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="faq section" id="perguntas">
          <div className="faq-intro" data-reveal>
            <Eyebrow>05 / PERGUNTAS FREQUENTES</Eyebrow>
            <h2>
              Clareza desde
              <br />
              <em>o primeiro contato.</em>
            </h2>
            <p>Algumas informações para ajudar você a dar o próximo passo.</p>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a], i) => (
              <details key={q}>
                <summary>
                  <span>0{i + 1}</span>
                  <h3>{q}</h3>
                  <i aria-hidden="true" />
                </summary>
                <div className="faq-answer">
                  <p>{a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
        <section className="contact section" id="contato">
          <div className="section-label">
            <span>06 / CONTATO</span>
            <span>RIO DE JANEIRO · RJ</span>
          </div>
          <div className="contact-grid">
            <div data-reveal>
              <Eyebrow>ESTAMOS À DISPOSIÇÃO PARA O PRIMEIRO CONTATO</Eyebrow>
              <h2>
                O próximo passo
                <br />
                começa com
                <br />
                <em>uma conversa.</em>
              </h2>
              <a className="contact-email" href={`mailto:${office.email}`}>
                {office.email}
                <Arrow />
              </a>
              {office.whatsapp && /^\d{10,15}$/.test(office.whatsapp) ? (
                <a
                  className="button primary contact-whatsapp"
                  href={`https://wa.me/${office.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Conversar pelo WhatsApp <Arrow />
                </a>
              ) : (
                <div className="whatsapp-demo">
                  <span className="button muted" aria-disabled="true">
                    WhatsApp · em breve <Arrow />
                  </span>
                  <small>Contato oficial pendente de confirmação.</small>
                </div>
              )}
              <a
                className="contact-instagram text-link"
                href={office.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram: @osmarmaltaadvogado (abre em nova aba)"
              >
                <span>Instagram · {office.instagramHandle}</span>
                <Arrow />
              </a>
              <p className="contact-region">
                Centro · Del Castilho · Santa Cruz
                <br />
                <span>
                  Rio de Janeiro — regiões informadas, sem endereço confirmado.
                </span>
              </p>
            </div>
            <form onSubmit={submit} className="contact-form">
              <p className="form-title">Conte-nos como podemos orientar.</p>
              <div className="form-row">
                <label>
                  Seu nome
                  <input
                    name="nome"
                    autoComplete="name"
                    placeholder="Nome completo"
                    required
                    maxLength={100}
                  />
                </label>
                <label>
                  E-mail ou telefone
                  <input
                    name="contato"
                    autoComplete="email"
                    placeholder="Como entrar em contato"
                    required
                    maxLength={150}
                  />
                </label>
              </div>
              <label>
                Assunto
                <select name="assunto" required defaultValue="">
                  <option disabled value="">
                    Selecione uma área
                  </option>
                  {areas.map((a) => (
                    <option key={a.title}>{a.title}</option>
                  ))}
                  <option>Outros assuntos</option>
                </select>
              </label>
              <label>
                Sua mensagem
                <textarea
                  name="mensagem"
                  rows={3}
                  placeholder="Descreva brevemente o assunto. Não inclua dados sensíveis."
                  required
                  maxLength={2000}
                />
              </label>
              <label className="consent">
                <input type="checkbox" required />
                <span>
                  Li o{" "}
                  <button type="button" onClick={() => setPrivacy(true)}>
                    aviso de privacidade
                  </button>{" "}
                  e concordo em compartilhar os dados desta mensagem para
                  contato.
                </span>
              </label>
              <button type="submit" className="button primary">
                Preparar e-mail <Arrow />
              </button>
              <p className="small-note">
                Este formulário abre seu aplicativo de e-mail. Revise e envie a
                mensagem por lá. Nenhum envio é realizado pelo site.
              </p>
            </form>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <a className="wordmark" href="#inicio">
            OSMAR MALTA<small>ADVOCACIA</small>
          </a>
          <p>
            Seriedade em cada decisão.
            <br />
            Atenção em cada história.
          </p>
          <a className="back-top" href="#inicio">
            VOLTAR AO TOPO ↑
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Dr. Osmar Malta.</span>
          <button onClick={() => setPrivacy(true)}>Privacidade</button>
          <span>PRÉVIA INSTITUCIONAL · DADOS SUJEITOS À VALIDAÇÃO</span>
        </div>
        <p className="legal-note">
          Retratos fornecidos para esta prévia. Cenas jurídicas ilustrativas,
          geradas por IA; não retratam clientes, processos ou instalações reais
          do escritório. Conteúdo informativo. Não constitui aconselhamento
          jurídico individual. OAB, endereço, horário e demais informações
          profissionais pendentes de confirmação. Publicação sujeita à revisão
          do advogado.
        </p>
      </footer>
      <dialog
        ref={dialog}
        className="privacy-dialog"
        onCancel={() => setPrivacy(false)}
        onClick={(e) => {
          if (e.target === dialog.current) setPrivacy(false);
        }}
      >
        <div>
          <button
            className="privacy-close"
            onClick={() => setPrivacy(false)}
            aria-label="Fechar aviso de privacidade"
          >
            ×
          </button>
          <Eyebrow>PRIVACIDADE</Eyebrow>
          <h2>
            Cuidado com
            <br />
            <em>suas informações.</em>
          </h2>
          <p>
            Esta prévia não armazena mensagens em um servidor nem utiliza
            ferramentas de análise ou cookies de marketing. Os campos do
            formulário são usados somente para preparar um e-mail no seu próprio
            aplicativo.
          </p>
          <p>
            Após o envio pelo seu provedor de e-mail, os dados serão recebidos
            em {office.email}. Evite informar dados sensíveis, documentos e
            informações de terceiros no primeiro contato.
          </p>
          <p>
            Para dúvidas sobre o tratamento de seus dados, entre em contato pelo
            mesmo e-mail. Antes da publicação, este aviso deve ser revisado para
            refletir as práticas efetivas do escritório e os direitos previstos
            na LGPD.
          </p>
          <button className="button primary" onClick={() => setPrivacy(false)}>
            Entendi <Arrow />
          </button>
        </div>
      </dialog>
    </div>
  );
}
