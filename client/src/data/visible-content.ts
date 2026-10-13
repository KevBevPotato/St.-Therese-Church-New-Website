export function visibleContent<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .filter(
        item =>
          !item ||
          typeof item !== "object" ||
          !("isHidden" in item) ||
          item.isHidden !== true
      )
      .map(item => visibleContent(item)) as T;
  }

  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      key === "isHidden" ? undefined : visibleContent(child),
    ]).filter(([key]) => key !== "isHidden")
  ) as T;
}
