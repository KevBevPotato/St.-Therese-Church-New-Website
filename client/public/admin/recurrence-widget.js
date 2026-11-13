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
  const actionLabels = {
    override: "Custom details",
    cancelled: "Cancellation notice",
    skip: "Removed",
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

  function getWeekdays(schedule) {
    const selectedDays = Array.isArray(schedule.daysOfWeek)
      ? schedule.daysOfWeek
      : [schedule.dayOfWeek];
    return selectedDays
      .map(day => typeof day === "number" ? day : weekdays.indexOf(day))
      .filter(day => day >= 0 && day < weekdays.length);
  }

  function dateOccurs(schedule, value) {
    const date = parseDate(value);
    const start = parseDate(schedule.startDate);
    const end = parseDate(schedule.endDate);
    if (!date || !start || date < start || (end && date > end)) return false;

    const weekdayMatches = getWeekdays(schedule).includes(date.getDay());
    switch (schedule.recurrenceType) {
      case "daily":
        return true;
      case "weekly":
        return weekdayMatches;
      case "monthly":
        return (
          weekdayMatches &&
          Math.ceil(date.getDate() / 7) === Number(schedule.ordinalWeek)
        );
      case "last_of_month":
        return (
          weekdayMatches &&
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 7
          ).getMonth() !== date.getMonth()
        );
      default:
        return false;
    }
  }

  function getOccurrences(schedule) {
    const start = parseDate(schedule.startDate);
    if (!start) return [];

    const end = parseDate(schedule.endDate);
    const until =
      end ||
      new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
    const excluded = new Set(
      (schedule.exclusions || []).map(item =>
        typeof item === "string" ? item : item.date
      )
    );
    const overrideByDate = new Map(
      (schedule.occurrenceOverrides || []).map(override => [
        override.date,
        override,
      ])
    );
    const occurrences = [];

    for (
      let date = new Date(start);
      date <= until && occurrences.length < 400;
      date.setDate(date.getDate() + 1)
    ) {
      if (!dateOccurs(schedule, formatDate(date))) continue;

      const value = formatDate(date);
      const override = overrideByDate.get(value);
      occurrences.push({
        date: value,
        included:
          !excluded.has(value) || (override && override.action !== "skip"),
        override,
      });
    }

    const occurrenceDates = new Set(occurrences.map(occurrence => occurrence.date));
    for (const override of schedule.occurrenceOverrides || []) {
      if (
        !occurrenceDates.has(override.date) &&
        dateOccurs(schedule, override.date)
      ) {
        occurrences.push({
          date: override.date,
          included: override.action !== "skip",
          override,
        });
      }
    }

    return occurrences.sort((a, b) => a.date.localeCompare(b.date));
  }

  const RecurrenceScheduleControl = window.createClass({
    getInitialState() {
      return { editingDate: null, exceptionDate: "", dateError: "" };
    },

    getSchedule() {
      return this.props.value && typeof this.props.value.toJS === "function"
        ? this.props.value.toJS()
        : { ...(this.props.value || {}) };
    },

    handleChange(field, value) {
      const schedule = this.getSchedule();
      const next = { ...schedule, [field]: value };

      if (field === "recurrenceType" && value === "daily") {
        next.dayOfWeek = schedule.dayOfWeek || "Sunday";
      }
      if (
        field === "recurrenceType" &&
        (value === "monthly" || value === "last_of_month") &&
        Array.isArray(schedule.daysOfWeek) &&
        schedule.daysOfWeek.length > 0
      ) {
        next.dayOfWeek = schedule.daysOfWeek[0];
      }

      this.props.onChange(next);
    },

    toggleWeekday(day, checked) {
      const schedule = this.getSchedule();
      const selectedDays = Array.isArray(schedule.daysOfWeek)
        ? schedule.daysOfWeek
        : [schedule.dayOfWeek || "Sunday"];
      const daysOfWeek = checked
        ? [...new Set([...selectedDays, day])]
        : selectedDays.filter(selectedDay => selectedDay !== day);
      this.props.onChange({ ...schedule, daysOfWeek });
    },

    toggleExclusion(date, included) {
      const schedule = this.getSchedule();
      const exclusions = (schedule.exclusions || []).filter(
        item => (typeof item === "string" ? item : item.date) !== date
      );
      const occurrenceOverrides = (schedule.occurrenceOverrides || []).map(
        override => ({ ...override })
      );
      const override = occurrenceOverrides.find(item => item.date === date);

      if (!included) {
        exclusions.push({ date });
        if (override) override.action = "skip";
      } else if (override && override.action === "skip") {
        override.action = "override";
      }

      this.props.onChange({ ...schedule, exclusions, occurrenceOverrides });
    },

    updateOccurrenceOverride(date, field, value) {
      const schedule = this.getSchedule();
      const occurrenceOverrides = [...(schedule.occurrenceOverrides || [])];
      let override = occurrenceOverrides.find(item => item.date === date);
      if (!override) {
        override = { date, action: "override" };
        occurrenceOverrides.push(override);
      } else {
        override = { ...override };
        occurrenceOverrides[
          occurrenceOverrides.findIndex(item => item.date === date)
        ] = override;
      }

      if (field === "action") {
        override.action = value;
      } else if (value) {
        override[field] = value;
      } else {
        delete override[field];
      }

      let exclusions = [...(schedule.exclusions || [])].filter(
        item => (typeof item === "string" ? item : item.date) !== date
      );
      if (override.action === "skip") exclusions.push({ date });

      this.props.onChange({
        ...schedule,
        exclusions,
        occurrenceOverrides,
      });
    },

    addExceptionDate() {
      const schedule = this.getSchedule();
      const date = this.state.exceptionDate;
      if (!dateOccurs(schedule, date)) {
        this.setState({
          dateError:
            "Choose a date that matches this schedule and falls within its date range.",
        });
        return;
      }

      const occurrenceOverrides = [...(schedule.occurrenceOverrides || [])];
      if (!occurrenceOverrides.some(override => override.date === date)) {
        occurrenceOverrides.push({ date, action: "override" });
      }
      const exclusions = (schedule.exclusions || []).filter(
        item => (typeof item === "string" ? item : item.date) !== date
      );
      this.props.onChange({ ...schedule, exclusions, occurrenceOverrides });
      this.setState({ editingDate: date, exceptionDate: "", dateError: "" });
    },

    render() {
      const schedule = this.getSchedule();
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
      const fieldStyle = {
        flex: "1 1 190px",
        minWidth: 0,
        marginBottom: 14,
      };
      const buttonStyle = {
        border: "1px solid #cbd5e1",
        borderRadius: 5,
        padding: "7px 10px",
        background: "#fff",
        color: "#17324f",
        cursor: "pointer",
        fontWeight: 600,
      };
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
      const weekdayField = () => {
        const selectedDays = Array.isArray(schedule.daysOfWeek)
          ? schedule.daysOfWeek
          : [schedule.dayOfWeek || "Sunday"];
        return h(
          "fieldset",
          {
            style: {
              ...fieldStyle,
              border: 0,
              padding: 0,
              marginLeft: 0,
              marginRight: 0,
            },
          },
          h("legend", { style: labelStyle }, "Days of week"),
          h(
            "div",
            { style: { display: "flex", flexWrap: "wrap", gap: "8px 12px" } },
            weekdays.map(day =>
              h(
                "label",
                {
                  key: day,
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                  },
                },
                h("input", {
                  type: "checkbox",
                  checked: selectedDays.includes(day),
                  disabled:
                    selectedDays.includes(day) && selectedDays.length === 1,
                  onChange: event =>
                    this.toggleWeekday(day, event.target.checked),
                }),
                day
              )
            )
          )
        );
      };
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
      const overrideField = (date, label, name, multiline) =>
        h(
          "label",
          { key: name, style: { display: "block", marginTop: 10 } },
          h("span", { style: labelStyle }, label),
          h(multiline ? "textarea" : "input", {
            type: multiline ? undefined : "text",
            rows: multiline ? 3 : undefined,
            value: (schedule.occurrenceOverrides || []).find(
              override => override.date === date
            )?.[name] || "",
            style: inputStyle,
            onChange: event =>
              this.updateOccurrenceOverride(date, name, event.target.value),
          })
        );
      const occurrenceEditor = (occurrence) => {
        const override = occurrence.override || {};
        const action = override.action || "override";
        const status =
          action === "skip"
            ? "Removed from calendar"
            : action === "cancelled"
              ? override.title || "Canceled"
              : Object.keys(override).some(
                    key => key !== "date" && key !== "action"
                  )
                ? "Custom details"
                : "Using recurring details";

        return h(
          "div",
          {
            key: occurrence.date,
            style: {
              padding: "10px 12px",
              borderBottom: "1px solid #e2e8f0",
              background: this.state.editingDate === occurrence.date
                ? "#f8fafc"
                : "#fff",
            },
          },
          h(
            "div",
            { style: { display: "flex", alignItems: "center", gap: 10 } },
            h("input", {
              type: "checkbox",
              checked: occurrence.included,
              "aria-label": `Include ${occurrenceLabel(occurrence.date)}`,
              onChange: event =>
                this.toggleExclusion(occurrence.date, event.target.checked),
            }),
            h(
              "div",
              { style: { flex: 1, minWidth: 0 } },
              h("strong", null, occurrenceLabel(occurrence.date)),
              h(
                "div",
                { style: { marginTop: 3, color: "#64748b", fontSize: 12 } },
                status
              )
            ),
            h(
              "button",
              {
                type: "button",
                style: buttonStyle,
                onClick: () =>
                  this.setState({
                    editingDate:
                      this.state.editingDate === occurrence.date
                        ? null
                        : occurrence.date,
                  }),
              },
              this.state.editingDate === occurrence.date
                ? "Close"
                : "Edit this date"
            )
          ),
          this.state.editingDate === occurrence.date &&
            h(
              "div",
              {
                style: {
                  margin: "12px 0 0 28px",
                  padding: 12,
                  border: "1px solid #dbe3ec",
                  borderRadius: 8,
                  background: "#fff",
                },
              },
              h(
                "label",
                { style: { display: "block", marginBottom: 10 } },
                h("span", { style: labelStyle }, "What happens on this date?"),
                h(
                  "select",
                  {
                    value: action,
                    style: inputStyle,
                    onChange: event =>
                      this.updateOccurrenceOverride(
                        occurrence.date,
                        "action",
                        event.target.value
                      ),
                  },
                  [
                    ["override", "Use custom details"],
                    ["cancelled", "Show cancellation notice"],
                    ["skip", "Remove this date from the calendar"],
                  ].map(([value, label]) =>
                    h("option", { key: value, value }, label)
                  )
                )
              ),
              action === "skip"
                ? h(
                    "p",
                    { style: { margin: 0, color: "#64748b", fontSize: 13 } },
                    "This occurrence will not appear on the calendar."
                  )
                : h(
                    "div",
                    null,
                    action === "cancelled" &&
                      h(
                        "p",
                        {
                          style: {
                            margin: "0 0 10px",
                            color: "#475569",
                            fontSize: 13,
                          },
                        },
                        'A cancellation notice is shown. Set the title to "No Mass" when appropriate; otherwise it defaults to "Canceled".'
                      ),
                    overrideField(
                      occurrence.date,
                      "Title",
                      "title",
                      false
                    ),
                    overrideField(occurrence.date, "Time", "time", false),
                    overrideField(
                      occurrence.date,
                      "Location",
                      "location",
                      false
                    ),
                    overrideField(
                      occurrence.date,
                      "Description",
                      "description",
                      true
                    ),
                    overrideField(
                      occurrence.date,
                      "About this event",
                      "about",
                      true
                    ),
                    overrideField(
                      occurrence.date,
                      "Sign-up URL",
                      "signupLink",
                      false
                    ),
                    overrideField(
                      occurrence.date,
                      "Contact person",
                      "contactPerson",
                      false
                    ),
                    overrideField(
                      occurrence.date,
                      "Contact email",
                      "contactEmail",
                      false
                    ),
                    overrideField(
                      occurrence.date,
                      "Contact phone",
                      "contactPhone",
                      false
                    )
                  )
            )
        );
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
          recurrenceType === "weekly"
            ? weekdayField()
            : recurrenceType !== "daily" &&
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
            ? "Preview generated dates. Uncheck Include to remove a date, or choose Edit this date to customize it. The preview is capped at 400 dates."
            : "No end date is set. The preview shows the first year; add an exception date below to edit a later occurrence."
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              gap: 10,
              marginBottom: 8,
            },
          },
          h(
            "label",
            { style: { ...fieldStyle, marginBottom: 0 } },
            h("span", { style: labelStyle }, "Add exception for another date"),
            h("input", {
              type: "date",
              value: this.state.exceptionDate,
              style: inputStyle,
              onChange: event =>
                this.setState({
                  exceptionDate: event.target.value,
                  dateError: "",
                }),
            })
          ),
          h(
            "button",
            {
              type: "button",
              style: buttonStyle,
              onClick: () => this.addExceptionDate(),
            },
            "Add date"
          )
        ),
        this.state.dateError &&
          h(
            "p",
            { role: "alert", style: { color: "#b91c1c", margin: "4px 0 10px" } },
            this.state.dateError
          ),
        !schedule.startDate
          ? h(
              "p",
              {
                style: { padding: 12, background: "#f8fafc", borderRadius: 4 },
              },
              "Choose a start date to preview generated occurrences."
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
                    maxHeight: 420,
                    overflowY: "auto",
                    border: "1px solid #cbd5e1",
                    borderRadius: 4,
                  },
                },
                occurrences.map(occurrence => occurrenceEditor(occurrence))
              )
      );
    },
  });

  window.CMS.registerWidget("recurrence-schedule", RecurrenceScheduleControl);
})();
