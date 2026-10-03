(function () {
  const h = window.h;

  const DateOrScheduleControl = window.createClass({
    handleChange(value) {
      this.props.onChange(value);
    },

    render() {
      const value = this.props.value || "";
      const inputStyle = {
        boxSizing: "border-box",
        width: "100%",
        minHeight: 40,
        padding: "8px 10px",
        border: "1px solid #cbd5e1",
        borderRadius: 5,
        background: "#fff",
      };

      return h(
        "div",
        {
          className: this.props.classNameWrapper,
          style: { display: "flex", flexWrap: "wrap", gap: 10 },
        },
        h("input", {
          type: "text",
          value,
          placeholder: "e.g. Ongoing or Every 1st Sunday",
          "aria-label": "Date or recurring schedule",
          style: { ...inputStyle, flex: "1 1 220px" },
          onChange: event => this.handleChange(event.target.value),
        }),
        h(
          "label",
          {
            title: "Choose a specific date",
            style: {
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 40,
              padding: "0 12px",
              border: "1px solid #cbd5e1",
              borderRadius: 5,
              background: "#f8fafc",
              color: "#17324f",
              fontWeight: 600,
              cursor: "pointer",
            },
          },
          "Choose date",
          h("input", {
            type: "date",
            value: /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "",
            "aria-label": "Choose a calendar date",
            style: {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
            },
            onChange: event => this.handleChange(event.target.value),
          })
        )
      );
    },
  });

  window.CMS.registerWidget("date-or-schedule", DateOrScheduleControl);
})();
