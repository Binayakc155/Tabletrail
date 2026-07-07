import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthPageShell({
  badge,
  title,
  description,
  highlights,
  formTitle,
  formDescription,
  children,
}: {
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  formTitle: string;
  formDescription: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
      <section className="flex flex-col justify-center gap-8">
        <Badge variant="secondary" className="w-fit bg-primary/10 text-primary">
          {badge}
        </Badge>
        <div className="space-y-5">
          <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">{title}</h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {highlights.map((highlight) => (
            <Card key={highlight} className="bg-background/80">
              <CardContent className="flex items-center gap-3 p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ArrowRight className="h-4 w-4" />
                </span>
                <p className="text-sm font-medium text-foreground">{highlight}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card className="overflow-hidden border-border/70 bg-card/90">
        <CardHeader className="space-y-3 border-b border-border/60 bg-muted/20">
          <CardTitle className="text-2xl">{formTitle}</CardTitle>
          <CardDescription className="max-w-xl leading-7">{formDescription}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">{children}</CardContent>
      </Card>
    </div>
  );
}
