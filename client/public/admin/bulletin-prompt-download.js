(function () {
  const link = document.createElement("a");
  link.href = "/admin/bulletin-parsing-prompt.txt";
  link.download = "bulletin-parsing-prompt.txt";
  link.textContent = "Download bulletin AI parsing prompt (.txt)";
  link.setAttribute("aria-label", "Download the bulletin AI parsing prompt as a text file");
  Object.assign(link.style, {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    zIndex: "10000",
    display: "none",
    padding: "12px 16px",
    borderRadius: "9999px",
    background: "#17324f",
    color: "#fff",
    boxShadow: "0 4px 14px #0003",
    font: "600 14px system-ui, sans-serif",
    textDecoration: "none",
  });

  function updateVisibility() {
    link.style.display = /bulletins/i.test(window.location.href) ? "block" : "none";
  }

  document.body.append(link);
  window.addEventListener("hashchange", updateVisibility);
  window.addEventListener("popstate", updateVisibility);
  updateVisibility();
})();
