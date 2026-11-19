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

  function occurrenceForSchedule(schedule, oneTimeOccurrences = []) {
    const firstOccurrence = [];
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
    const selectedDays =
      schedule.recurrenceType === "weekly" &&
      Array.isArray(schedule.daysOfWeek)
      ? schedule.daysOfWeek.map(value =>
          typeof value === "number" ? weekdays[value] : value
        )
      : [schedule.dayOfWeek || "Sunday"];

    for (
      const date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const weekdayMatches = selectedDays.includes(weekdays[date.getDay()]);
      const ordinal = Math.ceil(date.getDate() / 7);
      let matches = false;
      if (schedule.recurrenceType === "daily") matches = true;
      if (schedule.recurrenceType === "weekly") matches = weekdayMatches;
      if (schedule.recurrenceType === "monthly")
        matches =
          weekdayMatches && ordinal === Number(schedule.ordinalWeek || "1");
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
        const override = (schedule.occurrenceOverrides || []).find(
          item => item.date === result
        );
        if (!excluded.has(result) && (!override || override.action !== "skip")) {
          firstOccurrence.push(result);
          break;
        }
      }
    }
    return [
      ...firstOccurrence,
      ...(schedule.occurrenceOverrides || []),
      ...oneTimeOccurrences,
    ]
      .filter(item => typeof item === "string" || item.action !== "skip")
      .map(item => (typeof item === "string" ? item : item.date))
      .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date || ""))
      .sort()[0] || "";
  }

  function occurrenceFor(event, recurring) {
    if (!recurring) {
      const date = String(event.date || "");
      return {
        date: date.length > 10 ? date.slice(0, 10) : date,
        time: event.time,
      };
    }

    return [
      {
        schedule: event.schedule || {},
        time: event.time,
        oneTimeOccurrences: event.oneTimeOccurrences || [],
      },
      ...(event.additionalSchedules || []).map(additional => ({
        schedule: additional.schedule || additional,
        time: additional.time || event.time,
        oneTimeOccurrences: [],
      })),
    ]
      .map(item => ({
        ...item,
        date: occurrenceForSchedule(item.schedule, item.oneTimeOccurrences),
      }))
      .filter(item => item.date)
      .sort((left, right) => left.date.localeCompare(right.date))[0] || {
      date: "",
      time: event.time,
    };
  }

  function EventPreview(recurring) {
    return window.createClass({
      render() {
        const event = plainData(this.props.entry);
        const occurrence = occurrenceFor(event, recurring);
        const dateString = occurrence.date;
        const schedule = event.schedule || {};
        const occurrenceOverrides = recurring
          ? [
              ...(schedule.occurrenceOverrides || []).map(override => ({
                ...override,
                scheduleTime: event.time,
              })),
              ...(event.oneTimeOccurrences || []).map(override => ({
                ...override,
                scheduleTime: event.time,
              })),
              ...(event.additionalSchedules || []).flatMap(additional =>
                (additional.schedule?.occurrenceOverrides || []).map(
                  override => ({
                    ...override,
                    scheduleTime: additional.time || event.time,
                  })
                )
              ),
            ].filter(
              (override, index, overrides) =>
                overrides.findIndex(
                  item =>
                    item.date === override.date &&
                    item.scheduleTime === override.scheduleTime
                ) === index
            )
          : [];
        const previewOverride = occurrenceOverrides.find(
          override =>
            override.date === dateString &&
            override.scheduleTime === occurrence.time
        );
        const previewTime =
          previewOverride?.time || occurrence.time || event.time || "Time";
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
        const exceptionPreviews = occurrenceOverrides.map(override => {
          const exceptionDate = /^\d{4}-\d{2}-\d{2}$/.test(override.date || "")
            ? new Date(`${override.date}T12:00:00`)
            : null;
          const exceptionDateLabel = exceptionDate
            ? exceptionDate.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : override.date;
          const removed = override.action === "skip";
          const canceled = override.action === "cancelled";
          return h(
            "article",
            {
              key: override.date,
              style: {
                padding: 14,
                border: "1px solid #dbe3ec",
                borderRadius: 8,
                background: "#fff",
                marginTop: 10,
              },
            },
            h(
              "strong",
              { style: { display: "block", color: "#17324f" } },
              exceptionDateLabel
            ),
            h(
              "span",
              {
                style: {
                  display: "block",
                  marginTop: 4,
                  color: removed ? "#b91c1c" : "#64748b",
                  fontSize: 12,
                  fontWeight: 700,
                },
              },
              removed
                ? "Removed from the calendar"
                : canceled
                  ? "Cancellation notice"
                  : "Edited occurrence"
            ),
            !removed &&
              h(
                "div",
                { style: { marginTop: 8 } },
                h(
                  "strong",
                  null,
                  override.title || (canceled ? "Canceled" : event.title)
                ),
                h(
                  "p",
                  {
                    style: {
                      margin: "4px 0 0",
                      color: "#64748b",
                      fontSize: 12,
                    },
                  },
                  `${override.time || override.scheduleTime || event.time || "Time"} · ${override.location || event.location || "Location"}`
                ),
                (override.description || event.description) &&
                  h(
                    "p",
                    {
                      style: {
                        margin: "8px 0 0",
                        color: "#475569",
                        fontSize: 12,
                        whiteSpace: "pre-wrap",
                      },
                    },
                    override.description || event.description
                  )
              )
          );
        });
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
                  `${previewTime} · ${event.location || "Location"}`
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
                  `${previewTime} · ${event.location || "Location"}`
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
            ),
            recurring &&
              exceptionPreviews.length > 0 &&
              h(
                "div",
                { style: { marginTop: 18 } },
                h(
                    "h3",
                    {
                      style: {
                        margin: "0 0 8px",
                        color: "#17324f",
                        font: "bold 18px Georgia, serif",
                      },
                    },
                    "Date-specific previews"
                ),
                exceptionPreviews
              )
          )
        );
      },
    });
  }

  window.CMS.registerPreviewTemplate("one_time_events", EventPreview(false));
  window.CMS.registerPreviewTemplate("recurring_events", EventPreview(true));
})();
