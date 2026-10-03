(function () {
  const h = window.h;
  const sectionLabels = {
    mass_times: "Mass Times",
    announcements: "Announcements",
    new_parishioners: "New Parishioners",
    mass_intentions: "Mass Intentions",
    daily_scriptures: "Daily Scriptures",
    lectors: "Lectors",
    ushers: "Ushers",
    altar_servers: "Altar Servers",
    contributions: "Contributions",
    prayer_list: "Prayer List",
    a_little_laugh: "A Little Laugh",
    needs: "Community Needs",
    sponsors: "Sponsors",
  };

  function plainData(entry) {
    const data = entry.get("data");
    return data && typeof data.toJS === "function" ? data.toJS() : data || {};
  }

  function asText(value, limit = 260) {
    if (typeof value !== "string") return "";
    const text = value.trim();
    return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
  }

  function card(title, content, extraStyle = {}) {
    return h(
      "section",
      {
        style: {
          minWidth: 0,
          padding: 18,
          border: "1px solid #dbe3ec",
          borderRadius: 12,
          background: "#fff",
          boxShadow: "0 3px 12px #12243a0a",
          ...extraStyle,
        },
      },
      title &&
        h(
          "h3",
          {
            style: {
              margin: "0 0 10px",
              color: "#17324f",
              font: "bold 19px Georgia, serif",
              overflowWrap: "anywhere",
            },
          },
          title
        ),
      content
    );
  }

  function heading(data, fallback) {
    return data.title || data.pageTitle || data.name || fallback;
  }

  function Preview(renderContent) {
    return window.createClass({
      render() {
        const data = plainData(this.props.entry);
        return h(
          "main",
          {
            style: {
              display: "grid",
              gap: 16,
              maxWidth: 1120,
              margin: "0 auto",
              padding: 22,
              background: "#f5f7fa",
              color: "#172033",
              font: "14px/1.55 system-ui, sans-serif",
            },
          },
          renderContent(data)
        );
      },
    });
  }

  window.CMS.registerPreviewTemplate(
    "home_contact",
    Preview(data =>
      card(
        heading(data, "Contact the Parish"),
        h(
          "div",
          null,
          h("p", null, asText(data.description)),
          h("p", null, `${data.officeHours || ""} · ${data.phone || ""}`),
          h("p", null, `${data.email || ""} · ${data.address || ""}`)
        )
      )
    )
  );

  window.CMS.registerPreviewTemplate(
    "about_page_text",
    Preview(data =>
      card(
        heading(data, "About Saint Thérèse"),
        h(
          "div",
          null,
          h("p", null, asText(data.description)),
          h(
            "blockquote",
            { style: { margin: "20px 0 0", color: "#53657a" } },
            asText(data.quote)
          ),
          h("p", { style: { fontWeight: 700 } }, asText(data.quoteAttribution))
        )
      )
    )
  );

  window.CMS.registerPreviewTemplate(
    "staff_file",
    Preview(data =>
      h(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          },
        },
        ...(data.staff || []).map(member =>
          card(
            member.name || "Staff member",
            h(
              "div",
              null,
              h(
                "p",
                { style: { color: "#8b6728", fontWeight: 700 } },
                (member.titles || [])
                  .map(item => item.title)
                  .filter(Boolean)
                  .join(" · ")
              ),
              h("p", null, asText(member.duties || member.bio, 190)),
              h(
                "p",
                { style: { color: "#64748b", fontSize: 12 } },
                member.isHidden ? "Hidden from directory" : "Shown in directory"
              )
            )
          )
        )
      )
    )
  );

  window.CMS.registerPreviewTemplate(
    "bulletins_file",
    Preview(data => {
      const bulletins = data.bulletins || [];
      return h(
        "div",
        { style: { display: "grid", gap: 14 } },
        h(
          "header",
          null,
          h(
            "h1",
            {
              style: {
                margin: 0,
                color: "#17324f",
                font: "bold 30px Georgia, serif",
              },
            },
            "Parish Bulletin Preview"
          ),
          h(
            "p",
            { style: { margin: "6px 0 0", color: "#53657a" } },
            "Bulletin cards and the content sections shown on the bulletin page."
          )
        ),
        ...bulletins.map((bulletin, index) => {
          const sections = Object.entries(sectionLabels)
            .filter(([key]) => asText(bulletin[key]))
            .map(([key, label]) =>
              card(
                label,
                h(
                  "p",
                  {
                    style: {
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      color: "#53657a",
                    },
                  },
                  asText(bulletin[key], 200)
                ),
                { padding: 13, boxShadow: "none" }
              )
            );
          return card(
            bulletin.title || `Bulletin ${index + 1}`,
            h(
              "div",
              null,
              h(
                "p",
                { style: { margin: "0 0 12px", color: "#64748b" } },
                `${bulletin.startDate || "Start date"} – ${bulletin.endDate || "End date"}${bulletin.pdfUrl ? " · PDF attached" : ""}`
              ),
              sections.length
                ? h(
                    "div",
                    {
                      style: {
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(210px, 1fr))",
                        gap: 10,
                      },
                    },
                    ...sections
                  )
                : h(
                    "p",
                    { style: { color: "#64748b" } },
                    "No bulletin sections have been filled in yet."
                  )
            )
          );
        })
      );
    })
  );

  window.CMS.registerPreviewTemplate(
    "resources_file",
    Preview(data =>
      h(
        "div",
        { style: { display: "grid", gap: 16 } },
        h(
          "h1",
          {
            style: {
              margin: 0,
              color: "#17324f",
              font: "bold 30px Georgia, serif",
            },
          },
          "Resources Preview"
        ),
        ...(data.categories || []).map(category =>
          card(
            category.title,
            h(
              "div",
              null,
              h("p", null, asText(category.description)),
              h(
                "div",
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 10,
                  },
                },
                ...(category.links || []).map(link =>
                  card(link.title, h("p", null, asText(link.description)), {
                    padding: 13,
                    boxShadow: "none",
                  })
                )
              )
            )
          )
        )
      )
    )
  );

  window.CMS.registerPreviewTemplate(
    "faith_formation_file",
    Preview(data =>
      h(
        "div",
        { style: { display: "grid", gap: 14 } },
        h(
          "h1",
          {
            style: {
              margin: 0,
              color: "#17324f",
              font: "bold 30px Georgia, serif",
            },
          },
          "Faith Formation Preview"
        ),
        ...(data.categories || []).map(category =>
          card(
            category.title || "Formation program",
            h(
              "div",
              null,
              h(
                "p",
                null,
                asText(category.shortDescription || category.longDescription)
              ),
              h(
                "p",
                { style: { color: "#64748b" } },
                [
                  category.ageRange,
                  category.meetingTime,
                  category.location && `Room ${category.location}`,
                ]
                  .filter(Boolean)
                  .join(" · ")
              ),
              h(
                "p",
                null,
                `Resources: ${
                  (category.resources || [])
                    .map(resource => resource.title)
                    .filter(Boolean)
                    .join(", ") || "None listed"
                }`
              )
            )
          )
        )
      )
    )
  );

  window.CMS.registerPreviewTemplate(
    "get_involved_file",
    Preview(data => {
      const settings = data.settings || {};
      return h(
        "div",
        { style: { display: "grid", gap: 14 } },
        card(
          settings.pageTitle || "Get Involved",
          h("p", null, asText(settings.introduction))
        ),
        h(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 14,
            },
          },
          ...(data.opportunities || []).map(opportunity =>
            card(
              opportunity.title || "Opportunity",
              h(
                "div",
                null,
                h("p", null, asText(opportunity.description)),
                h(
                  "p",
                  { style: { color: "#64748b" } },
                  [
                    opportunity.organization,
                    opportunity.date,
                    opportunity.contactName,
                    opportunity.contactPhone,
                  ]
                    .filter(Boolean)
                    .join(" · ")
                ),
                h(
                  "p",
                  { style: { color: "#8b6728", fontWeight: 700 } },
                  `${(opportunity.signUpLinks || []).length} signup link(s)`
                )
              )
            )
          )
        )
      );
    })
  );

  window.CMS.registerPreviewTemplate(
    "organizations",
    Preview(data =>
      h(
        "div",
        { style: { display: "grid", gap: 14 } },
        card(
          heading(data, "Organization"),
          h(
            "div",
            null,
            h(
              "p",
              { style: { color: "#8b6728", fontWeight: 700 } },
              asText(data.tagline)
            ),
            h("p", null, asText(data.description)),
            h(
              "p",
              { style: { color: "#64748b" } },
              [
                data.meetingSchedule,
                data.room && `Room ${data.room}`,
                data.contactName,
                data.contactPhone,
              ]
                .filter(Boolean)
                .join(" · ")
            )
          )
        ),
        h(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
            },
          },
          ...(data.stats || []).map(stat =>
            card(
              stat.label,
              h(
                "strong",
                { style: { fontSize: 24, color: "#8b6728" } },
                stat.value
              )
            )
          ),
          ...(data.officers || []).map(officer =>
            card(officer.name || officer.title, h("p", null, officer.title))
          ),
          ...(data.members || [])
            .filter(member => !member.isHidden)
            .map(member =>
              card(
                member.name || "Member",
                h(
                  "p",
                  { style: { color: "#64748b" } },
                  "Visible in members gallery"
                )
              )
            )
        )
      )
    )
  );
})();
