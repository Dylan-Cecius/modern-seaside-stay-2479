export interface ServiceProps {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

interface ServiceCardProps {
  service: ServiceProps;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <div
      className="grid items-baseline gap-x-6 gap-y-2 py-7 scroll-reveal"
      style={{
        gridTemplateColumns: "auto 1fr auto",
        borderBottom: "1px dashed hsl(var(--muted-foreground) / 0.25)",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <span
        className="italic text-primary"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="text-2xl md:text-[1.45rem] font-medium text-foreground">{service.name}</h3>
      <span
        className="whitespace-nowrap"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.7rem",
          color: "hsl(var(--accent))",
        }}
      >
        {service.price}€
      </span>

      <p
        className="text-muted-foreground text-[0.9rem] max-w-lg"
        style={{ gridColumn: 2 }}
      >
        {service.description}
      </p>
      <span
        className="text-[0.72rem] uppercase text-muted-foreground text-right"
        style={{ gridColumn: 3, letterSpacing: "0.18em" }}
      >
        {service.duration}
      </span>
    </div>
  );
}
