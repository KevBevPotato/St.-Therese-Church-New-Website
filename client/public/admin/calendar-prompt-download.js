(function () {
  const link = document.createElement("a");
  link.href = "/admin/calendar-parsing-prompt.txt";
  link.download = "calendar-parsing-prompt.txt";
  link.textContent = "Download Calendar AI Prompt";
  link.dataset.calendarPromptDownload = "true";
  Object.assign(link.style, {
    display: "none",
    alignItems: "center",
    marginLeft: "8px",
    padding: "0 12px",
    minHeight: "36px",
    border: "1px solid #cbd5e1",
    borderRadius: "4px",
    background: "#fff",
    color: "#17324f",
    font: "600 14px system-ui, sans-serif",
    textDecoration: "none",
    whiteSpace: "nowrap",
  });
  document.body.append(link);

  function updateVisibility() {
    const isAdmin = window.location.pathname.replace(/\/+$/, "") === "/admin";
    const publishButton = [...document.querySelectorAll("button, [role='button']")]
      .filter(control => !control.hasAttribute("data-calendar-prompt-download"))
      .map(control => ({ control, rect: control.getBoundingClientRect() }))
      .find(({ control, rect }) =>
        /^publish(?:\s+(?:now|changes))?$/i.test(
          (control.getAttribute("aria-label") || control.textContent || "").replace(/\s+/g, " ").trim()
        ) && rect.width > 0 && rect.top >= 0 && rect.top < 160
      )?.control;

    link.style.display = isAdmin && publishButton ? "inline-flex" : "none";
    if (publishButton?.parentElement && link.previousElementSibling !== publishButton) {
      publishButton.insertAdjacentElement("afterend", link);
    }
  }

  new MutationObserver(updateVisibility).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  window.addEventListener("hashchange", updateVisibility);
  window.addEventListener("resize", updateVisibility);
  updateVisibility();
})();
