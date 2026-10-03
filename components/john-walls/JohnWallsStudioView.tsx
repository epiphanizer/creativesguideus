"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import {
  FiCpu,
  FiDisc,
  FiSliders,
  FiDownload,
  FiZap,
  FiVolume2,
  FiVolumeX,
  FiPlay,
  FiSquare,
  FiLayers,
  FiCheckCircle,
  FiMail
} from "react-icons/fi";
import CalligraphicSignatureTitle from "@/components/brand/CalligraphicSignatureTitle";
import SubtleCalligraphyAtmosphere from "@/components/home/SubtleCalligraphyAtmosphere";
import ContactModalLink from "@/components/contact/ContactModalLink";
import { buildContactHref } from "@/lib/contact-intake-routing";

const studioDispatchHref = buildContactHref({
  pathname: "/contact",
  overrides: {
    context: "johnwalls-studio-dispatch",
    project: "John Walls Studio",
    inquiryType: "partnership",
    surface: "campaign-world",
    sourceRoute: "/johnwalls-studio"
  }
});

const sampleInquiryHref = buildContactHref({
  pathname: "/contact",
  overrides: {
    context: "johnwalls-studio-sample-vault",
    project: "John Walls Studio",
    inquiryType: "licensing",
    surface: "campaign-world",
    sourceRoute: "/johnwalls-studio"
  }
});

export function JohnWallsStudioView() {
  // Mini interactive generative synth engine demo
  const [isPlayingGen, setIsPlayingGen] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopGenerativePreview = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlayingGen(false);
  }, []);

  const startGenerativePreview = useCallback(() => {
    if (isPlayingGen) {
      stopGenerativePreview();
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Pentatonic warm frequencies (analog feel)
      const scale = [146.83, 164.81, 196.0, 220.0, 261.63, 293.66, 329.63, 392.0];

      setIsPlayingGen(true);

      const triggerNote = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;
        const now = audioCtxRef.current.currentTime;
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        // Warm triangle / soft analog saw
        osc.type = Math.random() > 0.5 ? "triangle" : "sine";
        const freq = scale[Math.floor(Math.random() * scale.length)];
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start(now);
        osc.stop(now + 1.3);
      };

      // Play immediate note then cycle every 450-800ms
      triggerNote();
      timerRef.current = setInterval(() => {
        triggerNote();
      }, 550);
    } catch {
      setIsPlayingGen(false);
    }
  }, [isPlayingGen, stopGenerativePreview]);

  return (
    <div className="jw-domain-view jw-studio-view">
      {/* Background Canvas: Organic Ink Diffusion */}
      <div className="jw-atmosphere-container">
        <SubtleCalligraphyAtmosphere />
      </div>

      <div className="jw-domain-shell">
        {/* Navigation Bar */}
        <nav className="jw-domain-nav" aria-label="John Walls Network">
          <div className="jw-domain-nav__brand">
            <span className="jw-domain-nav__dot jw-domain-nav__dot--gold" />
            <span className="jw-domain-nav__label">JOHN WALLS · STUDIO & D2C SOUND HAVEN</span>
          </div>
          <div className="jw-domain-nav__links">
            <Link href="/johnwalls-rocks" className="jw-domain-pill">
              johnwalls.rocks ↗
            </Link>
            <span className="jw-domain-pill jw-domain-pill--active">johnwalls.studio</span>
            <Link href="/" className="jw-domain-pill">
              creativesguide.us ↗
            </Link>
          </div>
        </nav>

        {/* Hero Section with Calligraphic Signature */}
        <header className="jw-domain-hero">
          <CalligraphicSignatureTitle
            domain="johnwalls.studio"
            eyebrow="DIRECT-TO-CONSUMER PLATFORM · GENERATIVE SOUND LAB"
            badgeText="CREATOR PORTAL SPEC"
            kicker="Direct-to-consumer platform & resource site. Generative music haven, raw analog sample vault, and studio production workflows."
          />

          <div className="jw-hero-actions">
            <ContactModalLink href={studioDispatchHref} className="cg-btn cg-btn--primary">
              <FiZap aria-hidden="true" /> Claim Creator Early Access →
            </ContactModalLink>
            <button
              type="button"
              onClick={startGenerativePreview}
              className={`cg-btn ${isPlayingGen ? "cg-btn--accent" : "cg-btn--secondary"}`}
              aria-label={isPlayingGen ? "Stop Generative Audio Stream" : "Test Generative Audio Stream"}
            >
              {isPlayingGen ? (
                <>
                  <FiSquare aria-hidden="true" /> Stop Generative Stream
                </>
              ) : (
                <>
                  <FiPlay aria-hidden="true" /> Audition Generative Node 🔊
                </>
              )}
            </button>
          </div>
        </header>

        {/* Interactive Generative Haven Console */}
        <section className="jw-gen-console-section" aria-label="Generative Audio Node">
          <div className="jw-gen-console">
            <div className="jw-gen-console__header">
              <div className="jw-gen-console__led-group">
                <span className={`jw-gen-led ${isPlayingGen ? "jw-gen-led--active" : ""}`} />
                <span className="jw-gen-console__title">GENERATIVE MUSIC HAVEN // ENGINE STATUS: {isPlayingGen ? "SYNTHESIZING REAL-TIME" : "STANDBY"}</span>
              </div>
              <span className="jw-gen-console__chip">WEB AUDIO V2 · PENTATONIC RANDOM WALK</span>
            </div>
            <div className="jw-gen-console__body">
              <p>
                Our studio builds algorithmic sound environments that breathe continuously without looping.
                Procedural tape warmth, organic harmonic drift, and Markovian melody generation designed for
                immersive media, background focus, and film atmosphere.
              </p>
              <div className="jw-gen-controls">
                <button
                  type="button"
                  onClick={startGenerativePreview}
                  className="jw-gen-action-btn"
                >
                  {isPlayingGen ? (
                    <>
                      <FiVolumeX aria-hidden="true" /> Halt Engine
                    </>
                  ) : (
                    <>
                      <FiVolume2 aria-hidden="true" /> Initialize Audio Engine
                    </>
                  )}
                </button>
                <span className="jw-gen-note">
                  {isPlayingGen ? "Playing real-time procedural triangle/sine wave nodes" : "Press to test sound in-browser without plugins"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars Grid */}
        <section className="jw-pillars-section" aria-label="Studio Platform Pillars">
          <div className="jw-section-header">
            <span className="jw-section-header__tag">PLATFORM CAPABILITIES</span>
            <h2>Direct to Consumer Resources & Tools</h2>
            <p>Every tool, sample pack, and workflow created directly by John Walls for modern producers.</p>
          </div>

          <div className="jw-pillars-grid">
            {/* 1. D2C Sample Vault */}
            <article className="jw-pillar-card">
              <div className="jw-pillar-card__icon">
                <FiDisc aria-hidden="true" />
              </div>
              <div className="jw-pillar-card__badge">D2C DIRECT VAULT</div>
              <h3>Artisan Sample Library</h3>
              <p>
                Raw breakbeats chopped from 100W tape tracking, vintage hollowbody guitar one-shots,
                warm bass lines through custom transformers, and acoustic percussion.
              </p>
              <ul className="jw-pillar-list">
                <li><FiCheckCircle aria-hidden="true" /> 24-bit / 96kHz Lossless WAV format</li>
                <li><FiCheckCircle aria-hidden="true" /> 100% Royalty-Free direct licensing</li>
                <li><FiCheckCircle aria-hidden="true" /> Sampler formats: Ableton, Logic, EXS24</li>
              </ul>
              <div className="jw-pillar-footer">
                <ContactModalLink href={sampleInquiryHref} className="jw-link-button">
                  Sample Pack Specs & Pre-Orders →
                </ContactModalLink>
              </div>
            </article>

            {/* 2. Generative Music Haven */}
            <article className="jw-pillar-card">
              <div className="jw-pillar-card__icon">
                <FiCpu aria-hidden="true" />
              </div>
              <div className="jw-pillar-card__badge jw-pillar-card__badge--amber">ALGORITHMIC LAB</div>
              <h3>Generative Music Haven</h3>
              <p>
                Interactive algorithmic generators, generative ambient soundscapes, evolving tape loop nodes,
                and dynamic MIDI seed tools for film composers and electronic artists.
              </p>
              <ul className="jw-pillar-list">
                <li><FiCheckCircle aria-hidden="true" /> Non-repeating generative tape loops</li>
                <li><FiCheckCircle aria-hidden="true" /> Reactive Web Audio engines for apps</li>
                <li><FiCheckCircle aria-hidden="true" /> Continuous ambient broadcast feeds</li>
              </ul>
              <div className="jw-pillar-footer">
                <button type="button" onClick={startGenerativePreview} className="jw-link-button">
                  {isPlayingGen ? "Stop Audio Test" : "Audition Generative Node →"}
                </button>
              </div>
            </article>

            {/* 3. Studio Production Resources */}
            <article className="jw-pillar-card">
              <div className="jw-pillar-card__icon">
                <FiSliders aria-hidden="true" />
              </div>
              <div className="jw-pillar-card__badge jw-pillar-card__badge--neutral">POWER USER TOOLS</div>
              <h3>Studio Resources & Guides</h3>
              <p>
                Avid Melodyne power-user tuning curves, Pro Tools / Logic analog summing session templates,
                hardware routing schematics, and vocal chain blueprints.
              </p>
              <ul className="jw-pillar-list">
                <li><FiCheckCircle aria-hidden="true" /> Melodyne natural intonation curves</li>
                <li><FiCheckCircle aria-hidden="true" /> Console mix routing templates</li>
                <li><FiCheckCircle aria-hidden="true" /> Tube saturation gain-staging blueprints</li>
              </ul>
              <div className="jw-pillar-footer">
                <ContactModalLink href={studioDispatchHref} className="jw-link-button">
                  Request Resource Archive →
                </ContactModalLink>
              </div>
            </article>

            {/* 4. Direct Creator Services */}
            <article className="jw-pillar-card">
              <div className="jw-pillar-card__icon">
                <FiLayers aria-hidden="true" />
              </div>
              <div className="jw-pillar-card__badge jw-pillar-card__badge--gold">DIRECT STUDIO ACCESS</div>
              <h3>Commissioning & Sound Design</h3>
              <p>
                Custom film cues, analog re-amping, sound design for independent cinema,
                and bespoke generative audio installations direct from the studio floor.
              </p>
              <ul className="jw-pillar-list">
                <li><FiCheckCircle aria-hidden="true" /> Real 2-inch tape reel re-amping</li>
                <li><FiCheckCircle aria-hidden="true" /> Feature film & score sound design</li>
                <li><FiCheckCircle aria-hidden="true" /> Zero middlemen or agency fees</li>
              </ul>
              <div className="jw-pillar-footer">
                <ContactModalLink href={studioDispatchHref} className="jw-link-button">
                  Book Studio Session / Project →
                </ContactModalLink>
              </div>
            </article>
          </div>
        </section>

        {/* Dispatch Signup Banner */}
        <section className="jw-dispatch-banner">
          <div className="jw-dispatch-banner__inner">
            <div className="jw-dispatch-banner__text">
              <span className="jw-dispatch-kicker">EARLY ALPHA ACCESS</span>
              <h3>Get the Sample Packs & Generative Tools First.</h3>
              <p>
                Join the Creator Dispatch for private preview access to our inaugural 2-inch tape sample library
                and interactive generative audio seeds.
              </p>
            </div>
            <div className="jw-dispatch-banner__action">
              <ContactModalLink href={studioDispatchHref} className="cg-btn cg-btn--primary">
                <FiMail aria-hidden="true" /> Join the Creator Dispatch →
              </ContactModalLink>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="jw-domain-footer">
          <div className="jw-domain-footer__inner">
            <p>© {new Date().getFullYear()} John Walls Studio · Direct-to-Consumer Platform & Resource Site.</p>
            <div className="jw-domain-footer__links">
              <Link href="/johnwalls-rocks">johnwalls.rocks</Link>
              <span>·</span>
              <Link href="/walls-devine">walls-devine</Link>
              <span>·</span>
              <Link href="/contact">contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
