import CmsMarkdown from "@/components/CmsMarkdown";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MinimalAccordion, {
  type MinimalAccordionItem,
} from "@/components/MinimalAccordion";
import { getOrganizationById } from "@/data/organizations";
import headerData from "@/data/header_data.json";
import { Link } from "wouter";

type ParishLifeLink = {
  href?: string;
  label: string;
  children?: ParishLifeLink[];
};

const joinOrganizationLink = (
  headerData.parishLifeLinks as ParishLifeLink[]
).find(link => link.href === "/join-an-organization");
const organizationLinks = joinOrganizationLink?.children ?? [];
const organizationIdByPath: Record<string, string> = {
  "/st-vincent-de-paul-food-drive": "st-vincent-de-paul",
};

function getOrganizationId(href: string) {
  return (
    organizationIdByPath[href] ??
    href.split("/").filter(Boolean).at(-1) ??
    ""
  );
}

function getOrganizationContent(link: ParishLifeLink & { href: string }) {
  const organization = getOrganizationById(getOrganizationId(link.href));

  return (
    <div className="space-y-4">
      {organization?.tagline && (
        <p className="font-serif text-lg italic text-primary">
          {organization.tagline}
        </p>
      )}
      <CmsMarkdown>
        {organization?.description ??
          "Learn more about this parish organization and how to get involved."}
      </CmsMarkdown>
      {(organization?.meetingSchedule || organization?.audience) && (
        <div className="space-y-1 text-sm">
          {organization.audience && (
            <p>
              <strong className="text-primary">Who can join:</strong>{" "}
              {organization.audience}
            </p>
          )}
          {organization.meetingSchedule && (
            <p>
              <strong className="text-primary">Meeting schedule:</strong>{" "}
              {organization.meetingSchedule}
            </p>
          )}
        </div>
      )}
      <Link
        href={link.href}
        className="inline-flex font-bold text-primary underline-offset-4 hover:text-accent hover:underline"
      >
        Visit {organization?.name ?? link.label}
      </Link>
    </div>
  );
}

export default function OrganizationsLandingPage() {
  const sections: MinimalAccordionItem[] = organizationLinks
    .filter((link): link is ParishLifeLink & { href: string } =>
      Boolean(link.href)
    )
    .map(link => ({
      id: link.href,
      title: link.label,
      content: getOrganizationContent(link),
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
            Join an Organization
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Find fellowship, prayer, and meaningful ways to serve through one of
            our parish organizations.
          </p>
        </header>

        <MinimalAccordion items={sections} />
      </main>

      <Footer />
    </div>
  );
}
