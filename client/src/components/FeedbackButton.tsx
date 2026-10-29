import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitForm } from "@/lib/submit-form";

const inputClassName = "mt-1 w-full";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setStatus("sending");
    setErrorMessage("");
    try {
      await submitForm("feedback", {
        feedback_website: String(formData.get("feedback_website") ?? ""),
        feedback: String(formData.get("feedback") ?? "").trim(),
        from_name: String(formData.get("from_name") ?? "").trim(),
        from_email: String(formData.get("from_email") ?? "").trim(),
        page_url: window.location.href,
      });
      setStatus("success");
    } catch (error) {
      console.error("Website feedback submission failed:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not submit your feedback. Please try again."
      );
      setStatus("error");
    }
  };

  return (
    <>
      <Button
        type="button"
        className="fixed bottom-4 right-4 z-40 rounded-full px-4 shadow-lg sm:bottom-6 sm:right-6"
        onClick={() => handleOpenChange(true)}
        aria-label="Give feedback to the website"
      >
        <MessageSquare />
        <span>Give Feedback</span>
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {status === "success"
                ? "Thank you for your feedback"
                : "Give Feedback to the Website"}
            </DialogTitle>
            <DialogDescription>
              {status === "success"
                ? "Your feedback has been sent to the website team."
                : "Tell us what is working well or what we could improve."}
            </DialogDescription>
          </DialogHeader>
          {status === "success" ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto size-12 text-green-600" />
              <Button className="mt-5" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  name="feedback"
                  className={inputClassName}
                  required
                  maxLength={2000}
                  placeholder="What would you like us to know?"
                />
              </div>
              <div>
                <Label htmlFor="feedback-name">Name (optional)</Label>
                <Input
                  id="feedback-name"
                  name="from_name"
                  className={inputClassName}
                  maxLength={2000}
                />
              </div>
              <div>
                <Label htmlFor="feedback-email">Email (optional)</Label>
                <Input
                  id="feedback-email"
                  name="from_email"
                  type="email"
                  className={inputClassName}
                  maxLength={2000}
                />
              </div>
              <input
                type="text"
                name="feedback_website"
                id="feedback-website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px]"
              />
              {status === "error" && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}
              <Button
                type="submit"
                disabled={status === "sending"}
                className="w-full"
              >
                {status === "sending" && <Loader2 className="animate-spin" />}
                {status === "sending" ? "Sending..." : "Send Feedback"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
