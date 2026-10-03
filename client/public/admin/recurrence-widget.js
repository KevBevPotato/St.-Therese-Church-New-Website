(function () {
  const h = window.h;
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const recurrenceLabels = {
    daily: "Every day",
    weekly: "Every week",
    monthly: "A selected weekday each month",
    last_of_month: "The last selected weekday each month",
  };

  function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function parseDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
      ? date
      : null;
  }

  function getOccurrences(schedule) {
    const start = parseDate(schedule.startDate);
    if (!start) return [];

    const end = parseDate(schedule.endDate);
    const until =
      end ||
      new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
    const excluded = new Set(
      (schedule.exclusions || []).map(item => item.date)
    );
    const occurrences = [];

    for (
      let date = new Date(start);
      date <= until && occurrences.length < 400;
      date.setDate(date.getDate() + 1)
    ) {
      const day = date.getDate();
      const weekdayMatches =
        date.getDay() === weekdays.indexOf(schedule.dayOfWeek);
      let occurs = false;

      switch (schedule.recurrenceType) {
        case "daily":
          occurs = true;
          break;
        case "weekly":
          occurs = weekdayMatches;
          break;
        case "monthly":
          occurs =
            weekdayMatches &&
            Math.ceil(day / 7) === Number(schedule.ordinalWeek);
          break;
        case "last_of_month":
          occurs =
            weekdayMatches &&
            new Date(
              date.getFullYear(),
              date.getMonth(),
              day + 7
            ).getMonth() !== date.getMonth();
          break;
      }

      if (occurs) {
        const value = formatDate(date);
        occurrences.push({ date: value, included: !excluded.has(value) });
      }
    }

    return occurrences;
  }

  const RecurrenceScheduleControl = window.createClass({
    handleChange(field, value) {
      const schedule =
        this.props.value && typeof this.props.value.toJS === "function"
          ? this.props.value.toJS()
          : { ...(this.props.value || {}) };
      const next = { ...schedule, [field]: value };

      if (field === "recurrenceType" && value === "daily") {
        next.dayOfWeek = schedule.dayOfWeek || "Sunday";
      }

      this.props.onChange(next);
    },

    toggleExclusion(date, included) {
      const schedule =
        this.props.value && typeof this.props.value.toJS === "function"
          ? this.props.value.toJS()
          : { ...(this.props.value || {}) };
      const exclusions = (schedule.exclusions || []).filter(
        item => item.date !== date
      );
      if (!included) exclusions.push({ date });
      this.props.onChange({ ...schedule, exclusions });
    },

    render() {
      const schedule =
        this.props.value && typeof this.props.value.toJS === "function"
          ? this.props.value.toJS()
          : { ...(this.props.value || {}) };
      const recurrenceType = schedule.recurrenceType || "weekly";
      const occurrences = getOccurrences({ ...schedule, recurrenceType });
      const labelStyle = { display: "block", marginBottom: 5, fontWeight: 600 };
      const inputStyle = {
        boxSizing: "border-box",
        width: "100%",
        minHeight: 38,
        padding: "7px 9px",
        border: "1px solid #cbd5e1",
        borderRadius: 4,
        background: "white",
      };
      const fieldStyle = { flex: "1 1 190px", minWidth: 0, marginBottom: 14 };
      const dateField = (label, field) =>
        h(
          "label",
          { key: field, style: fieldStyle },
          h("span", { style: labelStyle }, label),
          h("input", {
            type: "date",
            value: schedule[field] || "",
            style: inputStyle,
            onChange: event => this.handleChange(field, event.target.value),
          })
        );
      const selectField = (label, field, options) =>
        h(
          "label",
          { key: field, style: fieldStyle },
          h("span", { style: labelStyle }, label),
          h(
            "select",
            {
              value: schedule[field] || options[0].value,
              style: inputStyle,
              onChange: event => this.handleChange(field, event.target.value),
            },
            options.map(option =>
              h(
                "option",
                { key: option.value, value: option.value },
                option.label
              )
            )
          )
        );
      const occurrenceLabel = date => {
        const parsed = parseDate(date);
        return parsed
          ? parsed.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : date;
      };

      return h(
        "div",
        { className: this.props.classNameWrapper },
        h(
          "div",
          { style: { display: "flex", flexWrap: "wrap", gap: "0 14px" } },
          dateField("Start date", "startDate"),
          dateField("End date (leave blank for no end)", "endDate"),
          selectField(
            "Repeats",
            "recurrenceType",
            Object.entries(recurrenceLabels).map(([value, label]) => ({
              value,
              label,
            }))
          ),
          recurrenceType !== "daily" &&
            selectField(
              "Day of week",
              "dayOfWeek",
              weekdays.map(day => ({ value: day, label: day }))
            ),
          recurrenceType === "monthly" &&
            selectField(
              "Week of month",
              "ordinalWeek",
              ["1", "2", "3", "4", "5"].map(week => ({
                value: week,
                label: `${week}${week === "1" ? "st" : week === "2" ? "nd" : week === "3" ? "rd" : "th"}`,
              }))
            )
        ),
        h(
          "p",
          { style: { margin: "0 0 10px", color: "#475569" } },
          schedule.endDate
            ? "Generated occurrences in this date range. Uncheck Include to skip a particular date. Previews are capped at 400 occurrences."
            : "No end date is set. Previewing up to one year of occurrences; skipped dates remain saved as exclusions."
        ),
        !schedule.startDate
          ? h(
              "p",
              {
                style: { padding: 12, background: "#f8fafc", borderRadius: 4 },
              },
              "Choose a start date to preview the generated occurrences."
            )
          : occurrences.length === 0
            ? h(
                "p",
                {
                  style: {
                    padding: 12,
                    background: "#f8fafc",
                    borderRadius: 4,
                  },
                },
                "No occurrences match this schedule. Check the date range and recurrence settings."
              )
            : h(
                "div",
                {
                  style: {
                    maxHeight: 280,
                    overflowY: "auto",
                    border: "1px solid #cbd5e1",
                    borderRadius: 4,
                  },
                },
                occurrences.map(occurrence =>
                  h(
                    "label",
                    {
                      key: occurrence.date,
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 12px",
                        borderBottom: "1px solid #e2e8f0",
                        cursor: "pointer",
                      },
                    },
                    h("input", {
                      type: "checkbox",
                      checked: occurrence.included,
                      onChange: event =>
                        this.toggleExclusion(
                          occurrence.date,
                          event.target.checked
                        ),
                    }),
                    h("span", null, occurrenceLabel(occurrence.date)),
                    !occurrence.included &&
                      h(
                        "strong",
                        { style: { marginLeft: "auto", color: "#b91c1c" } },
                        "Excluded"
                      )
                  )
                )
              )
      );
    },
  });

  window.CMS.registerWidget("recurrence-schedule", RecurrenceScheduleControl);
})();
