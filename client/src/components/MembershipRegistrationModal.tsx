import { useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { submitForm } from "@/lib/submit-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MembershipRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubmitStatus = "idle" | "sending" | "success" | "error";

const inputClassName =
  "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";
const labelClassName = "block text-sm font-medium text-foreground";
const sectionClassName =
  "space-y-5 rounded-2xl border border-primary/10 bg-card p-4 shadow-sm sm:p-6";

const MARITAL_STATUSES = [
  ["M", "Married, not valid — both Catholic"],
  ["C", "Married, valid — both Catholic"],
  ["I", "Married, valid interfaith"],
  ["N", "Married, not valid interfaith"],
  ["X", "Separated"],
  ["O", "Co-habitating"],
  ["S", "Single"],
  ["D", "Divorced"],
  ["W", "Widow/Widower"],
];

const PERSON_FIELDS = [
  ["first_name", "First Name"],
  ["preferred_name", "Preferred Name"],
  ["last_name", "Last Name"],
  ["maiden_name", "Maiden Name"],
  ["religion", "Religion"],
  ["employment", "Employment"],
  ["work_phone", "Work Phone"],
  ["date_of_birth", "Date of Birth"],
] as const;

const CHILD_PERSON_FIELDS = [
  ["first_name", "First Name"],
  ["preferred_name", "Preferred Name"],
  ["last_name", "Last Name"],
  ["religion", "Religion"],
  ["date_of_birth", "Date of Birth"],
] as const;

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  pattern,
  inputMode,
  children,
  ...props
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  pattern?: string;
  inputMode?: "numeric";
  children?: ReactNode;
  autoComplete?: string;
  maxLength?: number;
}) {
  return (
    <label className={labelClassName}>
      {label}
      {required && <span aria-hidden="true"> *</span>}
      {children ?? (
        <input
          className={inputClassName}
          name={name}
          type={type}
          required={required}
          maxLength={props.maxLength ?? 200}
          placeholder={placeholder}
          pattern={pattern}
          inputMode={inputMode}
          autoComplete={props.autoComplete}
        />
      )}
    </label>
  );
}

function PersonDetails({
  prefix,
  title,
  isAdult = false,
  isChild = false,
}: {
  prefix: string;
  title: string;
  isAdult?: boolean;
  isChild?: boolean;
}) {
  const personFields = isChild ? CHILD_PERSON_FIELDS : PERSON_FIELDS;

  return (
    <fieldset className="space-y-4 rounded-xl border border-primary/10 bg-primary/[0.025] p-4">
      <legend className="px-1 font-serif text-lg font-semibold text-primary">
        {title}
      </legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {personFields.map(([field, label]) => (
          <Field
            key={field}
            name={`${prefix}_${field}`}
            label={label}
            placeholder={field === "date_of_birth" ? "mm/dd/yyyy" : undefined}
            pattern={
              field === "date_of_birth" ? "\\d{2}/\\d{2}/\\d{4}" : undefined
            }
            inputMode={field === "date_of_birth" ? "numeric" : undefined}
          />
        ))}
        <Field name={`${prefix}_gender`} label="Gender">
          <select
            className={inputClassName}
            name={`${prefix}_gender`}
            defaultValue=""
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </Field>
        {(["baptism", "communion", "confirmation"] as const).map(sacrament => (
          <div key={sacrament} className="space-y-1 sm:col-span-2">
            <span className={labelClassName}>
              {sacrament[0].toUpperCase() + sacrament.slice(1)}
            </span>
            <div className="grid grid-cols-[minmax(0,1fr)_9rem] gap-2">
              <select
                className={`${inputClassName} mt-0`}
                name={`${prefix}_${sacrament}`}
                aria-label={`${sacrament} status for ${title}`}
                defaultValue=""
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Unknown">Unknown</option>
              </select>
              <input
                className={`${inputClassName} mt-0 max-w-28`}
                name={`${prefix}_${sacrament}_year`}
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                inputMode="numeric"
                placeholder="Year"
                aria-label={`${sacrament} year for ${title}`}
              />
            </div>
          </div>
        ))}
        {isAdult && (
          <>
            <Field
              name={`${prefix}_marriage_date`}
              label="Marriage Date"
              placeholder="mm/dd/yyyy"
              pattern="\\d{2}/\\d{2}/\\d{4}"
              inputMode="numeric"
            />
            <Field name={`${prefix}_annulment_status`} label="Annulment Status">
              <select
                className={inputClassName}
                name={`${prefix}_annulment_status`}
                defaultValue=""
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="In process">In process</option>
                <option value="Not applicable">Not applicable</option>
              </select>
            </Field>
          </>
        )}
      </div>
    </fieldset>
  );
}

export default function MembershipRegistrationModal({
  isOpen,
  onClose,
}: MembershipRegistrationModalProps) {
  const [childCount, setChildCount] = useState(0);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    setStatus("idle");
    setErrorMessage("");
    setChildCount(0);
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string> = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : "",
      ])
    );
    payload.financial_support = formData
      .getAll("financial_support")
      .map(value => String(value))
      .join(", ");
    payload.child_count = String(childCount);

    setStatus("sending");
    setErrorMessage("");

    try {
      await submitForm("membership", payload);
      setStatus("success");
    } catch (error) {
      console.error("Membership registration submission failed:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not submit the registration. Please try again."
      );
      setStatus("error");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className="flex h-[92dvh] max-h-[92dvh] max-w-5xl flex-col gap-0 overflow-hidden p-0"
        showCloseButton={false}
      >
        <DialogHeader className="shrink-0 bg-primary px-5 py-5 pr-16 text-left text-primary-foreground sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="font-serif text-2xl font-bold sm:text-3xl">
                Parish Membership Registration
              </DialogTitle>
              <DialogDescription className="mt-2 max-w-3xl text-sm text-primary-foreground/80">
                Welcome to the parish family. Complete the sections that apply
                to your household. Information is submitted securely to the
                parish registration spreadsheet.
              </DialogDescription>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-2 text-primary-foreground/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close membership registration"
            >
              <X size={22} />
            </button>
          </div>
        </DialogHeader>

        {status === "success" ? (
          <div className="overflow-y-auto p-8 text-center sm:p-12">
            <CheckCircle2 className="mx-auto size-14 text-green-600" />
            <h2 className="mt-4 font-serif text-2xl font-bold text-primary">
              Thank you for registering
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Your family registration has been received by the parish.
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
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 [-webkit-overflow-scrolling:touch] sm:p-8">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px]"
              />

              <section className={sectionClassName}>
                <div>
                  <h2 className="font-serif text-xl font-bold text-primary">
                    Primary Contact &amp; Family
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Contact details and parish registration information.
                  </p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Household
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <Field
                        name="family_name"
                        label="Family Name (Last)"
                        required
                        autoComplete="family-name"
                      />
                      <Field
                        name="first_name"
                        label="Primary Contact First Name"
                        required
                        autoComplete="given-name"
                      />
                      <Field name="spouse_name" label="Spouse Name" />
                      <Field name="title" label="Title">
                        <select
                          className={inputClassName}
                          name="title"
                          defaultValue=""
                        >
                          <option value="">Select</option>
                          {[
                            "Mr./Mrs.",
                            "Mr.",
                            "Mrs.",
                            "Ms.",
                            "Miss",
                            "Dr./Mrs.",
                          ].map(option => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field name="marital_status" label="Marital Status">
                        <select
                          className={inputClassName}
                          name="marital_status"
                          defaultValue=""
                        >
                          <option value="">Select</option>
                          {MARITAL_STATUSES.map(([value, label]) => (
                            <option key={value} value={value}>
                              {value} — {label}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-primary/10 pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Contact Details
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="sm:col-span-2 lg:col-span-3">
                        <Field
                          name="street_address"
                          label="Street Address"
                          required
                          autoComplete="street-address"
                        />
                      </div>
                      <Field
                        name="city"
                        label="City"
                        required
                        autoComplete="address-level2"
                      />
                      <Field
                        name="zip_code"
                        label="ZIP Code"
                        required
                        autoComplete="postal-code"
                        maxLength={10}
                      />
                      <Field
                        name="phone"
                        label="Phone"
                        type="tel"
                        autoComplete="tel"
                      />
                      <Field name="phone_unlisted" label="Phone Unlisted?">
                        <select
                          className={inputClassName}
                          name="phone_unlisted"
                          defaultValue=""
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </Field>
                      <Field
                        name="email"
                        label="Email"
                        type="email"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-primary/10 pt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Parish Registration
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        name="previous_church_membership"
                        label="Name of Previous Church"
                      />
                      <Field
                        name="previous_church_address"
                        label="Previous Church Street Address"
                        autoComplete="street-address"
                      />
                      <Field
                        name="previous_church_city"
                        label="Previous Church City"
                      />
                      <Field
                        name="previous_church_state"
                        label="Previous Church State"
                      />
                      <Field
                        name="previous_church_zip"
                        label="Previous Church ZIP Code"
                        maxLength={10}
                      />
                      <Field
                        name="previous_church_phone"
                        label="Previous Church Phone"
                        type="tel"
                        autoComplete="tel"
                      />
                      <Field
                        name="previous_church_email"
                        label="Previous Church Email"
                        type="email"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className={sectionClassName}>
                <div>
                  <h2 className="font-serif text-xl font-bold text-primary">
                    Church Attendance &amp; Support
                  </h2>
                </div>
                <fieldset className="space-y-2">
                  <legend className={labelClassName}>Church Attendance</legend>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {[
                      "Active",
                      "Regular",
                      "Occasional",
                      "Seldom",
                      "Snowbird",
                    ].map(option => (
                      <label
                        key={option}
                        className="inline-flex items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          name="church_attendance"
                          value={option}
                          className="accent-primary"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    name="mass_usually_attend"
                    label="Mass Usually Attended"
                  >
                    <select
                      className={inputClassName}
                      name="mass_usually_attend"
                      defaultValue=""
                    >
                      <option value="">Select</option>
                      <option value="Saturday 4:30pm">Saturday 4:30pm</option>
                      <option value="Sunday 9am">Sunday 9am</option>
                      <option value="Sunday 5:30pm">Sunday 5:30pm</option>
                    </select>
                  </Field>
                  <Field
                    name="tithe_envelopes"
                    label="Tithe by check: Would you like envelopes?"
                  >
                    <select
                      className={inputClassName}
                      name="tithe_envelopes"
                      defaultValue=""
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </Field>
                </div>
                <fieldset className="space-y-2">
                  <legend className={labelClassName}>Financial Support</legend>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {["Online", "Cash", "Check"].map(option => (
                      <label
                        key={option}
                        className="inline-flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          name="financial_support"
                          value={option}
                          className="size-4 accent-primary"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </section>

              <section className={sectionClassName}>
                <div>
                  <h2 className="font-serif text-xl font-bold text-primary">
                    Adult Family Members
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sacrament and personal details are optional unless needed
                    for parish records.
                  </p>
                </div>
                <div className="space-y-4">
                  <PersonDetails
                    prefix="head"
                    title="Head of Household"
                    isAdult
                  />
                  <PersonDetails prefix="spouse" title="Spouse" isAdult />
                </div>
              </section>

              <section className={sectionClassName}>
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-end">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-primary">
                      Children
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add a detail card for each child in your household.
                    </p>
                  </div>
                  <Field name="child_count" label="How many children?">
                    <select
                      className={inputClassName}
                      name="child_count"
                      value={childCount}
                      onChange={event =>
                        setChildCount(Number(event.target.value))
                      }
                    >
                      {Array.from({ length: 13 }, (_, count) => (
                        <option key={count} value={count}>
                          {count}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="space-y-4">
                  {Array.from({ length: childCount }, (_, index) => (
                    <PersonDetails
                      key={index + 1}
                      prefix={`child_${index + 1}`}
                      title={`Child ${index + 1}`}
                      isChild
                    />
                  ))}
                </div>
              </section>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Please share only the information needed for parish membership
                records. Your details will be sent to the parish registration
                spreadsheet.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 border-t bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div
                aria-live="polite"
                className="text-sm text-destructive sm:max-w-[60%]"
              >
                {status === "error" ? errorMessage : ""}
              </div>
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
                  {status === "sending" ? "Submitting…" : "Submit Registration"}
                </button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
