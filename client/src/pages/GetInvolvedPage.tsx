import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import getInvolvedData from "@/data/get-involved";
import headerData from "@/data/header_data.json";
import { Link } from "wouter";

type ParishLifeLink = {
  href?: string;
  label: string;
  children?: ParishLifeLink[];
};

const getInvolvedLink = (headerData.parishLifeLinks as ParishLifeLink[]).find(
  link => link.href === "/get-involved"
);
const pageLinks = getInvolvedLink?.children ?? [];
const descriptions: Record<string, string> = {
  "/liturgy": "Explore ways to serve during the celebration of Mass.",
  "/connect-groups": "Build community through prayer, fellowship, and discussion.",
  "/faith-formation": "Grow in faith and help form the next generation.",
  "/sacraments": "Learn about the sacraments and prepare to receive them.",
  "/need-help": "Let the parish know how we can support you.",
  "/contribute": "Support parish projects and share your gifts.",
};

export default function GetInvolvedPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fbfaf6]">
      <Header />
      <div className="pt-[var(--header-height)]" />

      <main className="container mx-auto flex-grow px-4 py-16">
        <header className="mb-10 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
            Parish Life
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-primary md:text-6xl">
            {getInvolvedData.settings.pageTitle ?? "Get Involved"}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {getInvolvedData.settings.introduction ??
              "Find a place to connect, grow in faith, serve, or ask for help."}
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          {pageLinks
            .filter((link): link is ParishLifeLink & { href: string } =>
              Boolean(link.href)
            )
            .map(link => (
              <Link key={link.href} href={link.href} className="block">
                <Card className="h-full border-2 border-primary/10 bg-white p-7 transition-colors hover:border-accent/50">
                  <h2 className="font-serif text-2xl font-bold text-primary">
                    {link.label}
                  </h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {descriptions[link.href] ??
                      "Explore this part of parish life and find your next step."}
                  </p>
                </Card>
              </Link>
            ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
