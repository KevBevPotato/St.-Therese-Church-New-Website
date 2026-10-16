(function () {
  const links = [
    {
      href: "/admin/bulletin-parsing-prompt.txt",
      filename: "bulletin-parsing-prompt.txt",
      label: "Download AI prompt",
    },
    {
      href: "/admin/bulletin-uploading-instructions.txt",
      filename: "Bulletin Uploading Instructions.txt",
      label: "Download Bulletin Uploading Instructions",
    },
  ].map(({ href, filename, label }) => {
    const link = document.createElement("a");
    link.href = href;
    link.download = filename;
    link.textContent = label;
    link.dataset.bulletinPromptDownload = "true";
    link.setAttribute("aria-label", label);
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
    return link;
  });

  function updateVisibility() {
    const pathname = window.location.pathname.replace(/\/+$/, "");
    const hash = window.location.hash.replace(/\/+$/, "");
    const isTargetEditor =
      pathname === "/admin" &&
      hash === "#/collections/bulletins/entries/bulletins_file";
    if (!isTargetEditor) {
      links.forEach(link => {
        link.hidden = true;
      });
      return;
    }

    const publishButton = [...document.querySelectorAll("button, [role='button']")]
      .filter(control => !control.hasAttribute("data-bulletin-prompt-download"))
      .map(control => {
        const label = (
          control.getAttribute("aria-label") ||
          control.textContent ||
          control.getAttribute("title") ||
          ""
        )
          .replace(/\s+/g, " ")
          .trim();
        return { control, label, rect: control.getBoundingClientRect() };
      })
      .filter(
        ({ control, label, rect }) =>
          /^publish(?:\s+(?:now|changes))?$/i.test(label) &&
          rect.width > 0 &&
          rect.height > 0 &&
          rect.top >= 0 &&
          rect.top < 160 &&
          getComputedStyle(control).visibility !== "hidden",
      )
      .sort((left, right) => left.rect.top - right.rect.top)[0]?.control;

    if (!publishButton?.parentElement) {
      links.forEach(link => {
        link.hidden = true;
      });
      return;
    }

    const toolbar = publishButton.parentElement;
    Object.assign(toolbar.style, {
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      alignItems: "center",
      gap: "8px",
    });
    links.forEach(link => {
      link.hidden = false;
    });
    let previous = publishButton;
    links.forEach(link => {
      if (link.previousElementSibling !== previous) {
        previous.insertAdjacentElement("afterend", link);
      }
      previous = link;
    });
  }

  const observer = new MutationObserver(updateVisibility);
  observer.observe(document.documentElement, {
    childList: true,
    characterData: true,
    subtree: true,
  });
  window.addEventListener("hashchange", updateVisibility);
  window.addEventListener("popstate", updateVisibility);
  window.addEventListener("resize", updateVisibility);
  updateVisibility();
})();
