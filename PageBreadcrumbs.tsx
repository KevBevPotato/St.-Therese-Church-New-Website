// Sacred Minimalism: quiet navigation cues, warm ivory surfaces, and restrained navy accents.
import { Fragment } from 'react';
import { Link } from 'wouter';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type BreadcrumbEntry = {
  label: string;
  href?: string;
};

export default function PageBreadcrumbs({ items }: { items: BreadcrumbEntry[] }) {
  return (
    <div className="border-b border-primary/8 bg-[#fbfaf6]">
      <div className="container py-3.5">
        <Breadcrumb aria-label="Breadcrumb">
          <BreadcrumbList className="text-xs sm:text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="font-medium text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <Fragment key={`${item.label}-${index}`}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {item.href && !isLast ? (
                      <BreadcrumbLink asChild>
                        <Link href={item.href} className="font-medium text-muted-foreground hover:text-primary">
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="font-semibold text-primary">{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
