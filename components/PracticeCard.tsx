"use client";
import Image from "next/image";
import type { areas } from "@/lib/content";
type Props = { area: (typeof areas)[number] };
export default function PracticeCard({ area }: Props) {
  function move(event: React.PointerEvent<HTMLAnchorElement>) {
    if (
      event.pointerType !== "mouse" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - box.left,
      y = event.clientY - box.top;
    event.currentTarget.style.setProperty("--mx", `${x}px`);
    event.currentTarget.style.setProperty("--my", `${y}px`);
    event.currentTarget.style.setProperty(
      "--tilt",
      `${(x / box.width - 0.5) * 4}deg`,
    );
  }
  return (
    <a
      href="#contato"
      className="practice-card"
      onPointerMove={move}
      onPointerLeave={(event) =>
        event.currentTarget.style.setProperty("--tilt", "0deg")
      }
      data-reveal
    >
      <div className="card-image">
        <Image
          src={area.image}
          alt={area.alt}
          fill
          sizes="(max-width: 767px) 88vw, (max-width: 1023px) 44vw, 31vw"
        />
        <span className="card-image-tag">CENA ILUSTRATIVA</span>
      </div>
      <div className="card-body">
        <div className="card-top">
          <span>ÁREA DE ATUAÇÃO</span>
          <span>{area.number}</span>
        </div>
        <h3>{area.title}</h3>
        <p>{area.text}</p>
        <span className="card-link">
          <span>CONVERSAR SOBRE O ASSUNTO</span>
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" />
          </svg>
        </span>
      </div>
    </a>
  );
}
