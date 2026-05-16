import Image from "next/image";

import { SectionShell } from "@/components/ui/SectionShell";

import posterImage from "@/app/bong-tour/assets/bong-tour-poster.png";
import volOneImage from "@/app/walls-devine/assets/covers/WallsDevineVol1.png";

const heroTitle = "Walls / Devine Vol. 1 + Bong Tour";

const featuredProjects = [
  {
    label: "Album release",
    title: "Walls / Devine Vol. 1",
    href: "/walls-devine",
    ctaLabel: "Open Volume 1",
    image: volOneImage,
    alt: "Walls Devine Vol. 1 album cover artwork"
  },
  {
    label: "Feature deck",
    title: "Bong Tour",
    href: "/bong-tour",
    ctaLabel: "Open Bong Tour",
    image: posterImage,
    alt: "Bong Tour poster artwork"
  }
];

export function HeroSection() {
  return (
    <SectionShell id="hero" variant="hero" labelledBy="hero-title" className="cg-home-hero-shell" innerClassName="cg-home-hero">
      <div className="cg-home-hero__intro">
        <span className="cg-home-hero__studio">Creatives Guide Us</span>
        <h1 id="hero-title" className="cg-home-hero__title">
          {heroTitle}
        </h1>
      </div>

      <div className="cg-home-hero__split" aria-label="Featured homepage projects">
        {featuredProjects.map((project, index) => (
          <a key={project.title} href={project.href} className="cg-home-hero__panel">
            <Image
              src={project.image}
              alt={project.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 920px) 100vw, 50vw"
              className="cg-home-hero__image"
            />

            <div className="cg-home-hero__overlay">
              <span className="cg-home-hero__label">{project.label}</span>
              <h2>{project.title}</h2>
              <span className="cg-home-hero__cta">{project.ctaLabel}</span>
            </div>
          </a>
        ))}
      </div>
    </SectionShell>
  );
}

export default HeroSection;
