import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CmsMarkdown from "@/components/CmsMarkdown";
import MinimalAccordion, {
  type MinimalAccordionItem,
} from "@/components/MinimalAccordion";
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
const liturgyRoleIds = ["lector", "usher", "altar-server", "music"];
const liturgyRoles = getInvolvedData.opportunities.filter(opportunity =>
  liturgyRoleIds.includes(opportunity.id)
);

function getSectionContent(link: ParishLifeLink) {
  const opportunityByPath: Record<string, string> = {
    "/connect-groups": "connect-groups",
    "/faith-formation": "wednesday-faith-formation",
  };
  const opportunity = getInvolvedData.opportunities.find(
    item => item.id === opportunityByPath[link.href ?? ""]
  );
  const description =
    opportunity?.landingPageDescription ??
    opportunity?.description ??
    (link.href === "/need-help"
      ? getInvolvedData.settings.parishLifePages?.needHelp?.introduction
      : link.href === "/contribute"
        ? getInvolvedData.settings.parishLifePages?.contribute?.introduction
        : descriptions[link.href ?? ""]);

  return (
    <div className="space-y-5">
      {link.href === "/liturgy" ? (
        <ul className="space-y-4">
          {liturgyRoles.map(role => (
            <li
              key={role.id}
              className="flex flex-col items-start gap-1 text-left"
            >
              <Link
                href={`/${role.id}`}
                className="font-semibold text-primary underline-offset-4 hover:text-accent hover:underline"
              >
                {role.title.replace(" Sign-up", "")}
              </Link>
              <span className="w-full text-left">{role.description}</span>
            </li>
          ))}
        </ul>
      ) : (
        <CmsMarkdown>{description}</CmsMarkdown>
      )}
      <Link
        href={link.href ?? "/get-involved"}
        className="inline-flex font-bold text-primary underline-offset-4 hover:text-accent hover:underline"
      >
        Explore {link.label}
      </Link>
    </div>
  );
}

export default function GetInvolvedPage() {
  const sections: MinimalAccordionItem[] = pageLinks
    .filter((link): link is ParishLifeLink & { href: string } =>
      Boolean(link.href)
    )
    .map(link => ({
      id: link.href,
      title: link.label,
      content: getSectionContent(link),
    }));

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

        <MinimalAccordion items={sections} />
      </main>

      <Footer />
    </div>
  );
}
