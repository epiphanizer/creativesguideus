import { SectionShell } from "@/components/ui/SectionShell";

const proofItems = [
  {
    label: "Appreesh.org",
    detail: "Co-founded on-chain gratitude platform — crypto-native ops with calm UX."
  },
  {
    label: "NBC Sports",
    detail: "World Cup Dreams 2025 sprint: digital hub, score suite, and launch cadence."
  },
  {
    label: "Agentic delivery",
    detail: "AI-assisted release kits keep WordPress-to-React migrations shipping cleanly."
  }
];

export function ProofStrip() {
  return (
    <SectionShell id="proof" labelledBy="proof-title" variant="compact" innerClassName="cg-proof">
      <p id="proof-title" className="cg-proof__title">
        Trusted when teams need composed releases, not chaotic launches.
      </p>
      <ul className="cg-proof__list" aria-label="Proof points">
        {proofItems.map((item) => (
          <li key={item.label} className="cg-proof__item">
            <span className="cg-proof__label">{item.label}</span>
            <span className="cg-proof__detail">{item.detail}</span>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

export default ProofStrip;
