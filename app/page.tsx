"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import PracticeCard from "@/components/PracticeCard";
import { useSiteMotion } from "@/components/useSiteMotion";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { contactMessage, whatsappLink, WHATSAPP_MESSAGES } from "@/lib/contact";
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
    [artVisible, setArtVisible] = useState(false),
    [contactVisible, setContactVisible] = useState(false),
    [preparedLink, setPreparedLink] = useState("");
  const main = useRef<HTMLDivElement>(null),
    menuButton = useRef<HTMLButtonElement>(null),
    dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => setIntro(false), 1950);
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
  useSiteMotion(main);
  useEffect(() => {
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        setContactVisible(visible.size > 0);
      },
      { rootMargin: "80px 0px" },
    );
    document
      .querySelectorAll("#contato,.site-footer")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const element = document.querySelector(".values-art");
    if (!element) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArtVisible(
            window.innerWidth >= 768 &&
              !matchMedia("(prefers-reduced-motion: reduce)").matches &&
              navigator.hardwareConcurrency > 2,
          );
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
    const form = e.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("nome") ?? "").trim(),
      contact: String(data.get("contato") ?? "").trim(),
      area: String(data.get("assunto") ?? "").trim(),
      message: String(data.get("mensagem") ?? "").trim(),
    };
    const name = form.elements.namedItem("nome") as HTMLInputElement;
    const contact = form.elements.namedItem("contato") as HTMLInputElement;
    const message = form.elements.namedItem("mensagem") as HTMLTextAreaElement;
    name.setCustomValidity(values.name.length < 2 ? "Informe seu nome." : "");
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contact);
    const digits = values.contact.replace(/\D/g, "");
    const isPhone =
      /^[+()\d\s.-]+$/.test(values.contact) &&
      digits.length >= 10 &&
      digits.length <= 15;
    contact.setCustomValidity(
      isEmail || isPhone
        ? ""
        : "Informe um telefone com DDD ou um e-mail válido.",
    );
    message.setCustomValidity(
      values.message ? "" : "Descreva brevemente o assunto.",
    );
    if (!form.reportValidity()) return;
    const link = whatsappLink(contactMessage(values));
    if (!link) return;
    setPreparedLink(link);
    window.open(link, "_blank", "noopener,noreferrer");
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
        <a
          className="header-cta"
          href={whatsappLink(WHATSAPP_MESSAGES.general) || "#contato"}
          target="_blank"
          rel="noopener noreferrer"
        >
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
            <span className="hero-axis" />
          </div>
          <div className="hero-portrait">
            <div className="portrait-frame">
              <Image
                className="hero-portrait-photo"
                src="/images/retrato-abertura.png"
                alt="Retrato fornecido para a apresentação de Dr. Osmar Malta"
                fill
                loading="eager"
                fetchPriority="high"
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
          className="human-editorial section"
          id="perspectiva"
          aria-labelledby="editorial-heading"
        >
          <div className="editorial-grid">
            <div className="editorial-copy" data-reveal>
              <Eyebrow>DIREITO COM PERSPECTIVA HUMANA</Eyebrow>
              <h2 id="editorial-heading">
                Além dos processos,
                <br />
                <em>existem pessoas.</em>
              </h2>
              <p>
                Ouvir o contexto de cada situação é o primeiro passo para uma
                orientação jurídica clara e responsável.
              </p>
              <span className="editorial-line" aria-hidden="true" />
            </div>
            <figure className="editorial-figure">
              <div className="editorial-photo">
                <div className="editorial-image-inner">
                  <Image
                    src="/images/direito-familia.png"
                    alt="Cena ilustrativa de uma conversa reservada de orientação jurídica com adultos"
                    fill
                    sizes="(max-width: 767px) 88vw, 44vw"
                  />
                </div>
                <span className="editorial-liquid" aria-hidden="true" />
              </div>
              <figcaption>
                CENA ILUSTRATIVA · ESCUTA E ORIENTAÇÃO JURÍDICA
              </figcaption>
            </figure>
          </div>
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
                  <span className="cursor-reveal" aria-hidden="true">
                    <Image src={areas[i % 3].image} alt="" fill sizes="110px" />
                  </span>
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
                  href={whatsappLink(WHATSAPP_MESSAGES.general)}
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
            <form
              onSubmit={submit}
              onInput={(event) => {
                setPreparedLink("");
                const target = event.target;
                if (
                  target instanceof HTMLInputElement ||
                  target instanceof HTMLTextAreaElement
                )
                  target.setCustomValidity("");
              }}
              className="contact-form"
              aria-describedby="form-explanation"
            >
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
                    autoComplete="off"
                    placeholder="Como entrar em contato"
                    required
                    maxLength={150}
                  />
                </label>
              </div>
              <label>
                Área jurídica
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
                Continuar pelo WhatsApp <WhatsAppIcon />
              </button>
              <p className="small-note" id="form-explanation">
                Ao continuar, o WhatsApp abre com sua mensagem preenchida.
                Revise e envie manualmente. O site não envia nem armazena sua
                mensagem.
              </p>
              {preparedLink && (
                <div className="form-prepared" role="status">
                  <p>
                    Mensagem preparada para revisão. Se a nova aba não abriu,
                    use o link abaixo.
                  </p>
                  <a
                    href={preparedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir conversa no WhatsApp <Arrow />
                  </a>
                </div>
              )}
              <a
                className="form-email-alternative"
                href={`mailto:${office.email}`}
              >
                Prefere e-mail? {office.email}
              </a>
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
      {!intro &&
        !menu &&
        !privacy &&
        !contactVisible &&
        whatsappLink(WHATSAPP_MESSAGES.general) && (
          <a
            className="whatsapp-float"
            href={whatsappLink(WHATSAPP_MESSAGES.general)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conversar pelo WhatsApp com Dr. Osmar Malta"
          >
            <WhatsAppIcon />
            <span>Conversar pelo WhatsApp</span>
          </a>
        )}
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
            formulário são usados somente para preparar uma mensagem no
            WhatsApp, após sua ação de continuar. Você revisa e envia
            manualmente.
          </p>
          <p>
            Ao abrir o WhatsApp, o conteúdo informado é incluído no link de
            conversa e compartilhado com esse serviço, sujeito às suas próprias
            regras de privacidade. Não inclua dados sensíveis, documentos ou
            informações de terceiros. O e-mail {office.email} permanece
            disponível como alternativa.
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
