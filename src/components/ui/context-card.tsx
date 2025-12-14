import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Info } from "lucide-react";

interface ContextCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  variant?: "default" | "info" | "highlight";
  className?: string;
  children?: React.ReactNode;
}

interface ContextSection {
  title?: string;
  content: string;
}

interface ContextCardWithSectionsProps {
  title: string;
  sections: ContextSection[];
  icon?: LucideIcon;
  variant?: "default" | "info" | "highlight";
  className?: string;
}

const variantStyles = {
  default: "bg-card border-border/50 hover:border-border",
  info: "bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40",
  highlight:
    "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 hover:border-primary/40",
};

export const ContextCard: React.FC<ContextCardProps> = ({
  title,
  description,
  icon: Icon = Info,
  variant = "default",
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "p-3 rounded-lg shrink-0",
            variant === "default" && "bg-muted text-muted-foreground",
            variant === "info" && "bg-blue-500/10 text-blue-500",
            variant === "highlight" && "bg-primary/10 text-primary"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};

export const ContextCardWithSections: React.FC<
  ContextCardWithSectionsProps
> = ({
  title,
  sections,
  icon: Icon = Info,
  variant = "default",
  className,
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "p-3 rounded-lg shrink-0",
            variant === "default" && "bg-muted text-muted-foreground",
            variant === "info" && "bg-blue-500/10 text-blue-500",
            variant === "highlight" && "bg-primary/10 text-primary"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-4">
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          <div className="space-y-3">
            {sections.map((section, index) => (
              <div key={index} className="space-y-1">
                {section.title && (
                  <h4 className="text-sm font-medium text-foreground/80">
                    {section.title}
                  </h4>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface PageContextProps {
  cards: {
    title: string;
    description: string;
    icon?: LucideIcon;
    variant?: "default" | "info" | "highlight";
  }[];
  className?: string;
}

export const PageContext: React.FC<PageContextProps> = ({
  cards,
  className,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {cards.map((card, index) => (
        <ContextCard
          key={index}
          title={card.title}
          description={card.description}
          icon={card.icon}
          variant={card.variant}
        />
      ))}
    </div>
  );
};
