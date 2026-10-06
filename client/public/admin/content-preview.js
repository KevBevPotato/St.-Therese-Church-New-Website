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
        const getAsset = this.props.getAsset;
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
          renderContent(data, getAsset)
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
    Preview((data, getAsset) =>
      h(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          },
        },
        ...(data.staff || []).map(member => {
          const photoUrl = member.photo
            ? getAsset(member.photo).toString()
            : "";
          return h(
            "article",
            {
              style: {
                minWidth: 0,
                overflow: "hidden",
                border: "1px solid #dbe3ec",
                background: "#fff",
                boxShadow: "0 3px 12px #12243a0a",
              },
            },
            h(
              "div",
              {
                style: {
                  aspectRatio: (member.photoAspect || "2/3").replace("/", " / "),
                  overflow: "hidden",
                  background: "#f1f5f9",
                },
              },
              photoUrl &&
                h("img", {
                  src: photoUrl,
                  alt: "",
                  style: {
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: member.photoFit === "cover" ? "cover" : "contain",
                    objectPosition: member.photoPosition || "center 25%",
                  },
                })
            ),
            h(
              "div",
              { style: { padding: 14 } },
              h(
                "h3",
                {
                  style: {
                    margin: "0 0 8px",
                    color: "#17324f",
                    font: "bold 19px Georgia, serif",
                    overflowWrap: "anywhere",
                  },
                },
                member.name || "Staff member"
              ),
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
          );
        })
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
    Preview((data, getAsset) =>
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
              ),
              h(
                "div",
                {
                  style: {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginTop: 12,
                  },
                },
                ...(category.catechists || [])
                  .filter(catechist => catechist.photo)
                  .slice(0, 4)
                  .map(catechist =>
                    h("img", {
                      src: getAsset(catechist.photo).toString(),
                      alt: `${catechist.name || "Catechist"} crop preview`,
                      title: `${catechist.name || "Catechist"} portrait crop`,
                      style: {
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        objectFit: "cover",
                        objectPosition: catechist.photoPosition || "center 25%",
                      },
                    })
                  )
              ),
              h(
                "div",
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: 8,
                    marginTop: 12,
                  },
                },
                ...(category.photos || [])
                  .slice(0, 4)
                  .map((photo, index) =>
                    h(
                      "div",
                      {
                        style: {
                          aspectRatio: "16 / 9",
                          overflow: "hidden",
                          background: "#f1f5f9",
                        },
                      },
                      h("img", {
                        src: getAsset(photo).toString(),
                        alt: `Program image ${index + 1} crop preview`,
                        style: {
                          display: "block",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition:
                            data.settings?.programPhotoPosition || "center",
                        },
                      })
                    )
                  )
              )
            )
          )
        )
      )
    )
  );

  window.CMS.registerPreviewTemplate(
    "announcements_file",
    Preview((data, getAsset) => {
      const settings = data.settings || {};
      const opacity = Math.max(
        0,
        Math.min(1, Number(settings.heroLinkOpacity ?? 0.78))
      );
      const badgePosition = settings.heroLinkPosition || "top-right";
      const positionStyles = {
        "top-right": { top: 12, right: 12 },
        "top-left": { top: 12, left: 12 },
        "bottom-right": { bottom: 12, right: 12 },
        "bottom-left": { bottom: 12, left: 12 },
      };
      const aspectRatio = (settings.cardImageAspect || "16/9").replace(
        "/",
        " / "
      );
      const announcements = data.announcements || [];

      return h(
        "div",
        { style: { display: "grid", gap: 16 } },
        card(
          settings.title || "Parish Announcements",
          h(
            "div",
            null,
            h("p", null, asText(settings.description)),
            h(
              "div",
              {
                style: {
                  position: "relative",
                  minHeight: 180,
                  padding: 16,
                  overflow: "hidden",
                  borderRadius: 10,
                  background:
                    "linear-gradient(120deg, #17324f, #6b7b8d)",
                },
              },
              h(
                "span",
                {
                  style: {
                    position: "absolute",
                    ...positionStyles[badgePosition],
                    maxWidth: "80%",
                    padding: "8px 12px",
                    borderRadius: 24,
                    background: previewColorWithOpacity(
                      settings.heroLinkBackgroundColor || "#102a45",
                      opacity
                    ),
                    color: settings.heroLinkTextColor || "#ffffff",
                    font: "bold 12px Arial, sans-serif",
                  },
                },
                "Parish announcement · Latest active notice"
              ),
              h(
                "p",
                {
                  style: {
                    position: "absolute",
                    left: 16,
                    bottom: 10,
                    color: "#fff",
                    font: "bold 16px Georgia, serif",
                  },
                },
                "Home hero announcement link placement preview"
              )
            )
          )
        ),
        h(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: `repeat(${settings.cardColumns === 2 ? 2 : 3}, minmax(0, 1fr))`,
              gap: 14,
            },
          },
          ...announcements.map(announcement =>
            h(
              "article",
              {
                style: {
                  minWidth: 0,
                  overflow: "hidden",
                  border: "1px solid #dbe3ec",
                  borderRadius: 10,
                  background: "#fff",
                },
              },
              h(
                "div",
                {
                  style: {
                    aspectRatio,
                    overflow: "hidden",
                    background: "#f1f5f9",
                  },
                },
                announcement.image &&
                  h("img", {
                    src: getAsset(announcement.image).toString(),
                    alt: announcement.imageAlt || "",
                    style: {
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: announcement.imagePosition || "center",
                    },
                  })
              ),
              h(
                "div",
                { style: { padding: 14 } },
                h(
                  "h3",
                  {
                    style: {
                      margin: "0 0 8px",
                      color: "#17324f",
                      font: "bold 18px Georgia, serif",
                    },
                  },
                  announcement.title || "Announcement title"
                ),
                h("p", null, asText(announcement.description, 140)),
                h(
                  "p",
                  { style: { color: "#64748b", fontSize: 12 } },
                  `${announcement.launchDate || "Launch date"} – ${announcement.expirationDate || "Expiration date"}`
                )
              )
            )
          )
        )
      );
    })
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
