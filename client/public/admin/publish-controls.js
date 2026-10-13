(function () {
  const createActions = new Set([
    "publish and create new",
    "publish & create new",
    "publish and duplicate",
    "publish & duplicate",
  ]);

  function simplifyPublishMenu() {
    document.querySelectorAll("button, [role='menuitem']").forEach(control => {
      const label = (control.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

      if (createActions.has(label)) {
        control.hidden = true;
        control.style.setProperty("display", "none", "important");
        return;
      }

      if (label === "publish now") {
        const walker = document.createTreeWalker(
          control,
          NodeFilter.SHOW_TEXT
        );
        let textNode;
        let labelUpdated = false;
        while ((textNode = walker.nextNode())) {
          if (textNode.textContent.trim() && !labelUpdated) {
            textNode.textContent = "Publish";
            labelUpdated = true;
          } else if (textNode.textContent.trim()) {
            textNode.textContent = "";
          }
        }
        control.setAttribute("aria-label", "Publish");
      }
    });
  }

  const observer = new MutationObserver(simplifyPublishMenu);
  observer.observe(document.documentElement, {
    childList: true,
    characterData: true,
    subtree: true,
  });
  simplifyPublishMenu();
})();
