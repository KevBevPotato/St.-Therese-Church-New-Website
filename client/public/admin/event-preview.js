(function () {
  const h = window.h;

  const colors = {
    sacramental: ["#fffbeb", "#b45309", "Sacramental Life"],
    parishEvents: ["#ecfdf5", "#047857", "Parish Events"],
    meeting: ["#f8fafc", "#475569", "Meeting"],
    vocations: ["#faf5ff", "#7e22ce", "Vocations"],
    diocesan: ["#eff6ff", "#1d4ed8", "Diocesan"],
  };

  function plainData(entry) {
    const data = entry.get("data");
    return data && typeof data.toJS === "function" ? data.toJS() : data || {};
  }

  function firstCategory(categories) {
    const category = (categories || [])[0];
    return typeof category === "string"
      ? category
      : category && category.category;
  }

  function previewAsset(getAsset, value) {
    return value ? getAsset(value).toString() : "";
  }

  function occurrenceFor(event, recurring) {
    if (!recurring) {
      const date = String(event.date || "");
      return date.length > 10 ? date.slice(0, 10) : date;
    }
    const schedule = event.schedule || {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(schedule.startDate || "")) return "";
    const [year, month, day] = schedule.startDate.split("-").map(Number);
    const start = new Date(year, month - 1, day);
    const end = /^\d{4}-\d{2}-\d{2}$/.test(schedule.endDate || "")
      ? new Date(
          ...schedule.endDate
            .split("-")
            .map(Number)
            .map((value, index) => (index === 1 ? value - 1 : value))
        )
      : new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
    const excluded = new Set(
      (schedule.exclusions || []).map(item =>
        typeof item === "string" ? item : item.date
      )
    );
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    for (
      const date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const weekdayMatches =
        date.getDay() === weekdays.indexOf(schedule.dayOfWeek);
      const ordinal = Math.ceil(date.getDate() / 7);
      let matches = false;
      if (schedule.recurrenceType === "daily") matches = true;
      if (schedule.recurrenceType === "weekly") matches = weekdayMatches;
      if (schedule.recurrenceType === "monthly")
        matches = weekdayMatches && ordinal === Number(schedule.ordinalWeek);
      if (schedule.recurrenceType === "last_of_month") {
        matches =
          weekdayMatches &&
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 7
          ).getMonth() !== date.getMonth();
      }
      if (matches) {
        const result = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        if (!excluded.has(result)) return result;
      }
    }
    return "";
  }

  function EventPreview(recurring) {
    return window.createClass({
      render() {
        const event = plainData(this.props.entry);
        const dateString = occurrenceFor(event, recurring);
        const date = /^\d{4}-\d{2}-\d{2}$/.test(dateString)
          ? new Date(`${dateString}T12:00:00`)
          : null;
        const [background, text, label] =
          colors[firstCategory(event.categories)] || colors.parishEvents;
        const gallery = event.gallery || [];
        const image = previewAsset(
          this.props.getAsset,
          event.image || (gallery[0] && gallery[0].photo)
        );
        const about =
          event.description ||
          event.about ||
          "No additional information available for this event.";
        const dateLabel = date
          ? date.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Choose a date to preview this event";
        const panelStyle = {
          flex: "1 1 320px",
          minWidth: 0,
          padding: 22,
          border: "1px solid #dbe3ec",
          borderRadius: 12,
          background: "#fff",
          boxShadow: "0 3px 12px #12243a0a",
        };
        const eyebrowStyle = {
          margin: "0 0 14px",
          color: "#64748b",
          font: "700 11px system-ui, sans-serif",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        };

        return h(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              gap: 18,
              padding: 20,
              background: "#f5f7fa",
              fontFamily: "system-ui, sans-serif",
              color: "#172033",
            },
          },
          h(
            "section",
            { style: panelStyle },
            h("p", { style: eyebrowStyle }, "Event card preview"),
            h(
              "article",
              {
                style: {
                  display: "flex",
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  background: "#fff",
                },
              },
              h(
                "div",
                {
                  style: {
                    flex: "0 0 68px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "14px 6px",
                    borderRight: "1px solid #e2e8f0",
                    color: "#17324f",
                  },
                },
                h(
                  "strong",
                  { style: { fontSize: 11, textTransform: "uppercase" } },
                  date
                    ? date.toLocaleDateString(undefined, { month: "short" })
                    : "DATE"
                ),
                h(
                  "strong",
                  { style: { fontSize: 26, fontFamily: "Georgia, serif" } },
                  date ? date.getDate() : "—"
                ),
                h(
                  "span",
                  { style: { fontSize: 10, textTransform: "uppercase" } },
                  date
                    ? date.toLocaleDateString(undefined, { weekday: "short" })
                    : ""
                )
              ),
              h(
                "div",
                { style: { minWidth: 0, padding: 16 } },
                h(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: 999,
                      background,
                      color: text,
                      fontSize: 10,
                      fontWeight: 800,
                      textTransform: "uppercase",
                    },
                  },
                  label
                ),
                h(
                  "h3",
                  {
                    style: {
                      margin: "10px 0",
                      color: "#17324f",
                      font: "bold 21px Georgia, serif",
                      overflowWrap: "anywhere",
                    },
                  },
                  event.title || "Event title"
                ),
                h(
                  "p",
                  {
                    style: {
                      margin: 0,
                      color: "#64748b",
                      fontSize: 12,
                      lineHeight: 1.6,
                    },
                  },
                  `${event.time || "Time"} · ${event.location || "Location"}`
                )
              )
            )
          ),
          h(
            "section",
            { style: { ...panelStyle, flex: "2 1 420px" } },
            h("p", { style: eyebrowStyle }, "Event landing page preview"),
            h(
              "div",
              {
                style: {
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "#fff",
                },
              },
              h(
                "div",
                {
                  style: {
                    padding: "22px 24px",
                    background: "linear-gradient(135deg, #17324f, #315879)",
                    color: "#fff",
                  },
                },
                h(
                  "p",
                  {
                    style: {
                      margin: "0 0 8px",
                      color: "#f1d99d",
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    },
                  },
                  `${label} · ${dateLabel}`
                ),
                h(
                  "h2",
                  {
                    style: {
                      margin: "0 0 8px",
                      font: "bold 34px/1.1 Georgia, serif",
                    },
                  },
                  event.title || "Event title"
                ),
                h(
                  "p",
                  { style: { margin: 0, color: "#ffffffd9", fontSize: 14 } },
                  `${event.time || "Time"} · ${event.location || "Location"}`
                )
              ),
              image &&
                h("img", {
                  src: image,
                  alt: "",
                  style: {
                    display: "block",
                    width: "100%",
                    maxHeight: 260,
                    objectFit: "cover",
                  },
                }),
              h(
                "div",
                { style: { padding: 24 } },
                h(
                  "h3",
                  {
                    style: {
                      margin: "0 0 10px",
                      color: "#17324f",
                      font: "bold 22px Georgia, serif",
                    },
                  },
                  "About this Event"
                ),
                h(
                  "p",
                  {
                    style: {
                      margin: 0,
                      color: "#475569",
                      fontSize: 14,
                      lineHeight: 1.7,
                      whiteSpace: "pre-wrap",
                    },
                  },
                  about
                ),
                event.signupLink &&
                  h(
                    "span",
                    {
                      style: {
                        display: "inline-block",
                        marginTop: 18,
                        padding: "10px 14px",
                        borderRadius: 6,
                        background: "#17324f",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                      },
                    },
                    "Register / More Info"
                  ),
                gallery.length > 1 &&
                  h(
                    "p",
                    {
                      style: {
                        margin: "18px 0 0",
                        color: "#64748b",
                        fontSize: 12,
                      },
                    },
                    `${gallery.length} gallery photos`
                  )
              )
            )
          )
        );
      },
    });
  }

  window.CMS.registerPreviewTemplate("one_time_events", EventPreview(false));
  window.CMS.registerPreviewTemplate("recurring_events", EventPreview(true));
})();
