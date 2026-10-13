import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SignupRequest } from "@/contexts/InterestSignupContext";
import { submitForm } from "@/lib/submit-form";

const inputClassName =
  "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";

export default function InterestSignupModal({
  request,
  onClose,
}: {
  request: SignupRequest | null;
  onClose: () => void;
}) {
  const [kind, setKind] = useState<SignupRequest["kind"]>("join");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setKind(
      request?.kind === "choose" ? "volunteer" : (request?.kind ?? "join")
    );
    setStatus("idle");
    setErrorMessage("");
  }, [request]);

  const handleClose = () => {
    setStatus("idle");
    setErrorMessage("");
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!request) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, string> = {
      website: String(formData.get("website") ?? ""),
      from_name: String(formData.get("from_name") ?? "").trim(),
      from_email: String(formData.get("from_email") ?? "").trim(),
      from_phone: String(formData.get("from_phone") ?? "").trim(),
      interest: request.title,
      context_opportunity: request.id,
      signup_kind: kind,
      availability: String(formData.get("availability") ?? "").trim(),
      notes: String(formData.get("notes") ?? "").trim(),
      participant_name: String(formData.get("participant_name") ?? "").trim(),
      participant_grade: String(formData.get("participant_grade") ?? ""),
      guardian_name: String(formData.get("guardian_name") ?? "").trim(),
    };

    setStatus("sending");
    setErrorMessage("");
    try {
      const isFaithFormation = request.id === "wednesday-faith-formation";
      await submitForm(
        isFaithFormation ? "faith_formation" : "interest",
        payload
      );
      setStatus("success");
    } catch (error) {
      console.error("Get Involved signup failed:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not submit your interest. Please try again."
      );
      setStatus("error");
    }
  };

  return (
    <Dialog
      open={!!request}
      onOpenChange={open => {
        if (!open) handleClose();
      }}
    >
      {request && (
        <DialogContent
          className="flex h-[92dvh] max-h-[92dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
          showCloseButton={false}
        >
          <DialogHeader className="shrink-0 bg-primary px-5 py-5 pr-16 text-left text-primary-foreground sm:px-8">
            <DialogTitle className="font-serif text-2xl font-bold">
              {status === "success"
                ? "Thank you for reaching out"
                : request.title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-primary-foreground/80">
              {status === "success"
                ? "Your interest has been recorded for parish staff to review. They can follow up using the contact information you provided."
                : "Share your contact details so parish staff can review your interest and follow up."}
            </DialogDescription>
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-2 text-primary-foreground/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close interest form"
            >
              <X size={22} />
            </button>
          </DialogHeader>

          {status === "success" ? (
            <div className="overflow-y-auto p-8 text-center sm:p-12">
              <CheckCircle2 className="mx-auto size-14 text-green-600" />
              <p className="mt-4 text-muted-foreground">
                Your request was submitted successfully.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-7 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Close
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-5 [-webkit-overflow-scrolling:touch] sm:p-8">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px]"
                />

                {request.kind === "choose" && (
                  <fieldset className="space-y-2">
                    <legend className="text-sm font-semibold text-foreground">
                      How would you like to participate?
                    </legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        ["volunteer", "Volunteer as a catechist/helper"],
                        ["class_registration", "Register a participant"],
                      ].map(([value, label]) => (
                        <label
                          key={value}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition ${
                            kind === value
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-input hover:border-primary/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name="signup_kind_choice"
                            value={value}
                            checked={kind === value}
                            onChange={() =>
                              setKind(value as SignupRequest["kind"])
                            }
                            className="accent-primary"
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-foreground">
                    Your name <span aria-hidden="true">*</span>
                    <input
                      className={inputClassName}
                      name="from_name"
                      required
                      maxLength={200}
                      autoComplete="name"
                    />
                  </label>
                  <label className="text-sm font-medium text-foreground">
                    Email <span aria-hidden="true">*</span>
                    <input
                      className={inputClassName}
                      name="from_email"
                      type="email"
                      required
                      maxLength={200}
                      autoComplete="email"
                    />
                  </label>
                  <label className="text-sm font-medium text-foreground sm:col-span-2">
                    Phone (optional)
                    <input
                      className={inputClassName}
                      name="from_phone"
                      type="tel"
                      maxLength={80}
                      autoComplete="tel"
                    />
                  </label>

                  {kind === "class_registration" && (
                    <>
                      <label className="text-sm font-medium text-foreground">
                        Participant name <span aria-hidden="true">*</span>
                        <input
                          className={inputClassName}
                          name="participant_name"
                          required
                          maxLength={200}
                        />
                      </label>
                      <label className="text-sm font-medium text-foreground">
                        Grade
                        <select
                          className={inputClassName}
                          name="participant_grade"
                          defaultValue=""
                        >
                          <option value="">Select grade</option>
                          {[
                            "Pre-K",
                            "Kindergarten",
                            ...Array.from({ length: 12 }, (_, index) =>
                              String(index + 1)
                            ),
                            "Adult",
                          ].map(grade => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-sm font-medium text-foreground sm:col-span-2">
                        Parent/guardian name <span aria-hidden="true">*</span>
                        <input
                          className={inputClassName}
                          name="guardian_name"
                          required
                          maxLength={200}
                          autoComplete="name"
                        />
                      </label>
                    </>
                  )}

                  <label className="text-sm font-medium text-foreground sm:col-span-2">
                    Availability (optional)
                    <textarea
                      className={`${inputClassName} min-h-20 resize-y`}
                      name="availability"
                      maxLength={1000}
                      placeholder="Days, times, or dates that work for you"
                    />
                  </label>
                  <label className="text-sm font-medium text-foreground sm:col-span-2">
                    Anything else you’d like us to know? (optional)
                    <textarea
                      className={`${inputClassName} min-h-24 resize-y`}
                      name="notes"
                      maxLength={1000}
                    />
                  </label>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  Your information will be used by parish staff to follow up
                  about this opportunity. This form does not sign you up for
                  text messages.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 border-t bg-background px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <p aria-live="polite" className="text-sm text-destructive">
                  {status === "error" ? errorMessage : ""}
                </p>
                <div className="flex gap-3 sm:ml-auto">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={status === "sending"}
                    className="rounded-lg border border-input px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
                  >
                    {status === "sending" && (
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                    )}
                    {status === "sending" ? "Submitting…" : "Send interest"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
// Get this to work!
