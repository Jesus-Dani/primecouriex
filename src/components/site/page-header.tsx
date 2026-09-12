const EYEBROW = "text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase";

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-14 pb-4 sm:px-6 sm:pt-20">
      <p className={EYEBROW}>{eyebrow}</p>
      <h1 className="text-foreground mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold sm:text-4xl">
        {title}
      </h1>
      {intro && <p className="text-muted-foreground mt-4 max-w-2xl text-lg">{intro}</p>}
    </div>
  );
}
