import Section from "@/components/layout/Section";

interface Stat {
  value: string;
  label: string;
}

interface StatsStripProps {
  stats?: Stat[];
}

const DEFAULT_STATS: Stat[] = [
  { value: "1947", label: "Anno di fondazione" },
  { value: "6", label: "Servizi attivi" },
  { value: "24/7", label: "Reperibilità" },
  { value: "ODV", label: "Organizzazione di volontariato" },
];

export default function StatsStrip({ stats = DEFAULT_STATS }: StatsStripProps) {
  return (
    <Section dark tight>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-2">
            <span className="font-mono text-[clamp(1.75rem,3vw,2.5rem)] tracking-[0.04em] text-bg">
              {s.value}
            </span>
            <p className="body-sm text-bg/55">{s.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
