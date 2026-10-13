export async function submitForm(
  formType:
    | "pledge"
    | "engagement"
    | "supper-volunteer"
    | "lector"
    | "membership"
    | "interest"
    | "faith_formation",
  payload: Record<string, unknown>
): Promise<void> {
  const response = await fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, form_type: formType }),
  });

  const result: unknown = await response.json().catch(() => null);
  if (
    !response.ok ||
    !result ||
    typeof result !== "object" ||
    !("success" in result) ||
    result.success !== true
  ) {
    const message =
      result &&
      typeof result === "object" &&
      "error" in result &&
      typeof result.error === "string"
        ? result.error
        : "The submission could not be saved. Please try again later.";
    throw new Error(message);
  }
}
