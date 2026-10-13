import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SubmissionValue = string | number | boolean | null | undefined;

interface PendingReview {
  title: string;
  payload: Record<string, SubmissionValue>;
  onConfirm: () => Promise<void>;
}

function formatLabel(key: string): string {
  return key
    .replace(/^child_(\d+)_/, "Child $1 ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, character => character.toUpperCase());
}

function formatValue(value: SubmissionValue): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === null || value === undefined || value === "") {
    return "(not provided)";
  }
  return String(value);
}

export function useSubmissionReview() {
  const [pending, setPending] = useState<PendingReview | null>(null);

  const reviewSubmission = (
    title: string,
    payload: Record<string, SubmissionValue>,
    onConfirm: () => Promise<void>
  ) => setPending({ title, payload, onConfirm });

  const reviewDialog = (
    <Dialog
      open={pending !== null}
      onOpenChange={open => {
        if (!open) setPending(null);
      }}
    >
      {pending && (
        <DialogContent className="flex max-h-[85dvh] max-w-2xl flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="shrink-0 bg-primary px-6 py-5 text-left text-primary-foreground">
            <DialogTitle className="font-serif text-2xl font-bold">
              Is this correct?
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/80">
              Review your {pending.title.toLowerCase()} information before
              submitting.
            </DialogDescription>
          </DialogHeader>
          <dl className="min-h-0 flex-1 space-y-3 overflow-y-auto p-6">
            {Object.entries(pending.payload)
              .filter(([key]) => key !== "website")
              .map(([key, value]) => (
                <div
                  key={key}
                  className="grid gap-1 border-b border-primary/10 pb-3 sm:grid-cols-[minmax(9rem,0.7fr)_1fr] sm:gap-4"
                >
                  <dt className="text-sm font-semibold text-primary">
                    {formatLabel(key)}
                  </dt>
                  <dd className="whitespace-pre-wrap break-words text-sm text-foreground">
                    {formatValue(value)}
                  </dd>
                </div>
              ))}
          </dl>
          <DialogFooter className="shrink-0 gap-3 border-t border-primary/10 p-5 sm:justify-between">
            <button
              type="button"
              onClick={() => setPending(null)}
              className="rounded-lg border border-primary/20 px-5 py-3 font-semibold text-primary transition hover:bg-primary/5"
            >
              No, go back and edit
            </button>
            <button
              type="button"
              onClick={() => {
                const review = pending;
                setPending(null);
                void review.onConfirm();
              }}
              className="rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Yes, submit
            </button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );

  return { reviewSubmission, reviewDialog };
}
