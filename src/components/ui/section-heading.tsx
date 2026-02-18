import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={cn("mb-12", align === "center" && "text-center", className)}
    >
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-charcoal-700/70 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          "mt-4 h-1 w-16 bg-gold-500 rounded-full",
          align === "center" && "mx-auto"
        )}
      />
    </div>
  );
}
