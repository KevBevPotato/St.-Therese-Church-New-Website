(function () {
  const link = document.createElement("a");
  link.href = "/admin/bulletin-parsing-prompt.txt";
  link.download = "bulletin-parsing-prompt.txt";
  link.textContent = "Download AI prompt";
  link.setAttribute("aria-label", "Download the bulletin AI parsing prompt as a text file");
  Object.assign(link.style, {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
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
    boxSizing: "border-box",
  });
  link.hidden = true;

  function updateVisibility() {
    const isBulletinEditor = /bulletins/i.test(window.location.href);
    if (!isBulletinEditor) {
      link.remove();
      return;
    }

    const publishButton = [...document.querySelectorAll("button")]
      .filter(button => button !== link)
      .find(button => {
        const label = (button.textContent || "").replace(/\s+/g, " ").trim();
        return /^publish(?: changes| now)?$/i.test(label);
      });

    if (publishButton && link.previousElementSibling !== publishButton) {
      publishButton.insertAdjacentElement("afterend", link);
    }
    link.hidden = !publishButton;
  }

  const observer = new MutationObserver(updateVisibility);
  observer.observe(document.documentElement, {
    childList: true,
    characterData: true,
    subtree: true,
  });
  window.addEventListener("hashchange", updateVisibility);
  window.addEventListener("popstate", updateVisibility);
  updateVisibility();
})();
