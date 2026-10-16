(function () {
  const link = document.createElement("a");
  link.href = "/admin/bulletin-parsing-prompt.txt";
  link.download = "bulletin-parsing-prompt.txt";
  link.textContent = "Download AI prompt";
  link.dataset.bulletinPromptDownload = "true";
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
  document.body.append(link);

  function updateVisibility() {
    const route = `${window.location.pathname}${window.location.hash}`;
    const isBulletinEditor = /bulletins/i.test(route);
    if (!isBulletinEditor) {
      link.hidden = true;
      return;
    }

    const publishButton = [...document.querySelectorAll("button, [role='button'], a")]
      .filter(control => !control.hasAttribute("data-bulletin-prompt-download"))
      .find(control => {
        const label = [
          control.textContent,
          control.getAttribute("aria-label"),
          control.getAttribute("title"),
        ]
          .filter(Boolean)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        return /\bpublish\b/i.test(label);
      });

    if (publishButton) {
      link.style.position = "static";
      link.style.right = "";
      link.style.top = "";
      link.style.zIndex = "";
      link.style.boxShadow = "none";
      link.hidden = false;
      if (link.previousElementSibling !== publishButton) {
        publishButton.insertAdjacentElement("afterend", link);
      }
    } else {
      link.style.position = "fixed";
      link.style.right = "20px";
      link.style.top = "20px";
      link.style.zIndex = "10000";
      link.style.boxShadow = "0 4px 14px #0003";
      link.hidden = false;
    }
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
