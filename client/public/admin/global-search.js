(function () {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Search CMS";
  button.setAttribute("aria-haspopup", "dialog");
  button.setAttribute("aria-label", "Search all CMS content");
  Object.assign(button.style, {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    zIndex: "10000",
    border: "0",
    borderRadius: "999px",
    padding: "12px 18px",
    background: "#17324f",
    color: "#fff",
    boxShadow: "0 4px 18px #0003",
    font: "600 14px system-ui, sans-serif",
    cursor: "pointer",
  });

  const overlay = document.createElement("div");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Search CMS content");
  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    zIndex: "10001",
    display: "none",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "8vh 16px 16px",
    background: "#0f172acc",
    boxSizing: "border-box",
    font: "14px system-ui, sans-serif",
  });

  const panel = document.createElement("section");
  Object.assign(panel.style, {
    width: "min(720px, 100%)",
    maxHeight: "84vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: "12px",
    background: "#fff",
    color: "#172033",
    boxShadow: "0 20px 60px #0005",
  });

  const header = document.createElement("div");
  Object.assign(header.style, {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "18px 20px",
    borderBottom: "1px solid #e2e8f0",
  });

  const input = document.createElement("input");
  input.type = "search";
  input.placeholder = "Search events, staff, page text, links…";
  input.setAttribute("aria-label", "Search all CMS content");
  Object.assign(input.style, {
    width: "100%",
    minWidth: "0",
    border: "0",
    outline: "0",
    font: "16px system-ui, sans-serif",
  });

  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Close";
  Object.assign(close.style, {
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    padding: "6px 10px",
    background: "white",
    color: "#334155",
    cursor: "pointer",
  });

  const status = document.createElement("p");
  status.setAttribute("aria-live", "polite");
  Object.assign(status.style, {
    margin: "0",
    padding: "12px 20px",
    color: "#64748b",
  });

  const results = document.createElement("div");
  results.setAttribute("role", "listbox");
  Object.assign(results.style, { overflowY: "auto", padding: "0 12px 12px" });

  header.append(input, close);
  panel.append(header, status, results);
  overlay.append(panel);
  document.body.append(button, overlay);

  let documentsPromise;
  function loadDocuments() {
    if (!documentsPromise) {
      documentsPromise = fetch("/admin/content-search-index.json", {
        cache: "no-store",
      })
        .then(response => {
          if (!response.ok)
            throw new Error(
              `Search index request failed (${response.status}).`
            );
          return response.json();
        })
        .then(data => {
          if (!Array.isArray(data.documents))
            throw new Error("Search index has an invalid format.");
          return data.documents;
        })
        .catch(error => {
          documentsPromise = null;
          throw error;
        });
    }
    return documentsPromise;
  }

  function snippetFor(document, query) {
    const text = String(document.text || "")
      .replace(/\s+/g, " ")
      .trim();
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index < 0) return text.slice(0, 140);
    const start = Math.max(0, index - 55);
    const end = Math.min(text.length, index + query.length + 85);
    return `${start ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
  }

  function renderResults(documents) {
    const query = input.value.trim().toLowerCase();
    results.replaceChildren();
    if (query.length < 2) {
      status.textContent =
        "Type at least two characters to search saved CMS content.";
      return;
    }

    const terms = query.split(/\s+/).filter(Boolean);
    const matches = documents
      .map(document => {
        const searchable =
          `${document.title} ${document.section} ${document.text}`.toLowerCase();
        return {
          document,
          searchable,
          score: document.title.toLowerCase().startsWith(query)
            ? 0
            : searchable.startsWith(query)
              ? 1
              : 2,
        };
      })
      .filter(({ searchable }) =>
        terms.every(term => searchable.includes(term))
      )
      .sort(
        (a, b) =>
          a.score - b.score || a.document.title.localeCompare(b.document.title)
      )
      .slice(0, 40);

    status.textContent = matches.length
      ? `${matches.length}${matches.length === 40 ? "+" : ""} matching items. Select one to open its CMS entry.`
      : "No matching saved content found.";

    for (const { document: resultDocument } of matches) {
      const link = document.createElement("a");
      link.href = resultDocument.route;
      link.setAttribute("role", "option");
      Object.assign(link.style, {
        display: "block",
        padding: "12px",
        marginTop: "8px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        color: "inherit",
        textDecoration: "none",
      });
      const title = document.createElement("strong");
      title.textContent = resultDocument.title;
      const section = document.createElement("span");
      section.textContent = ` · ${resultDocument.section}`;
      section.style.color = "#64748b";
      const snippet = document.createElement("p");
      snippet.textContent = snippetFor(resultDocument, query);
      Object.assign(snippet.style, {
        margin: "6px 0 0",
        color: "#475569",
        lineHeight: "1.4",
      });
      link.append(title, section, snippet);
      link.addEventListener("click", event => {
        event.preventDefault();
        closeDialog();
        window.location.hash = resultDocument.route;
      });
      results.append(link);
    }
  }

  function openDialog() {
    overlay.style.display = "flex";
    input.value = "";
    results.replaceChildren();
    status.textContent = "Loading searchable CMS content…";
    loadDocuments()
      .then(renderResults)
      .catch(error => {
        status.textContent = `Could not load the search index. ${error.message}`;
      });
    input.focus();
  }

  function closeDialog() {
    overlay.style.display = "none";
    button.focus();
  }

  button.addEventListener("click", openDialog);
  close.addEventListener("click", closeDialog);
  input.addEventListener("input", () => {
    loadDocuments()
      .then(renderResults)
      .catch(error => {
        status.textContent = `Could not load the search index. ${error.message}`;
      });
  });
  overlay.addEventListener("click", event => {
    if (event.target === overlay) closeDialog();
  });
  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openDialog();
    } else if (event.key === "Escape" && overlay.style.display !== "none") {
      closeDialog();
    }
  });
})();
