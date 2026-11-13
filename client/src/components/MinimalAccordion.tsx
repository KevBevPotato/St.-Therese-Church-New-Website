import type { ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface MinimalAccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export default function MinimalAccordion({
  items,
}: {
  items: MinimalAccordionItem[];
}) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full border-t border-primary/15"
    >
      {items.map(item => (
        <AccordionItem
          key={item.id}
          value={item.id}
          className="border-primary/15 last:border-b"
        >
          <AccordionTrigger className="group items-center py-6 text-left font-serif text-xl font-semibold text-primary hover:no-underline [&>svg]:hidden">
            <span className="flex w-full items-center justify-between gap-6">
              <span>{item.title}</span>
              <span
                aria-hidden="true"
                className="flex size-6 shrink-0 items-center justify-center"
              >
                <Plus className="size-5 group-data-[state=open]:hidden" />
                <Minus className="hidden size-5 group-data-[state=open]:block" />
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
