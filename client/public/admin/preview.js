const h = window.h;

function previewColorWithOpacity(color, opacity) {
  const match = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(color || "");
  if (!match) return `rgba(16, 42, 69, ${opacity})`;

  const [, red, green, blue] = match;
  return `rgba(${parseInt(red, 16)}, ${parseInt(green, 16)}, ${parseInt(blue, 16)}, ${opacity})`;
}

const HeroPreview = window.createClass({
  render() {
    const data = this.props.entry.get("data");
    const get = (key, fallback = "") => {
      const value = data.get(key);
      return value == null ? fallback : value;
    };
    const overlayStrength = Math.max(
      0,
      Math.min(1, Number(get("overlayStrength", 0.9)))
    );
    const overlayColor = get("overlayColor", "#102a45");
    const backgroundColor = get("backgroundColor", "#102a45");
    const textColor = get("textColor", "#ffffff");
    const fit = get("mediaFit", "cover") === "contain" ? "contain" : "cover";
    const position = get("mediaPosition", "center");
    const videoUrl = get("videoUrl");
    const poster = get("poster");
    const previewVideo = videoUrl
      ? this.props.getAsset(videoUrl).toString()
      : "";
    const previewPoster = poster ? this.props.getAsset(poster).toString() : "";
    const mediaStyle = {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: fit,
      objectPosition: position,
    };
    const overlayStyle = {
      position: "absolute",
      inset: 0,
      background: `linear-gradient(90deg, ${previewColorWithOpacity(overlayColor, overlayStrength)} 0%, ${previewColorWithOpacity(overlayColor, overlayStrength * 0.64)} 58%, ${previewColorWithOpacity(overlayColor, overlayStrength * 0.1)} 100%), linear-gradient(0deg, ${previewColorWithOpacity(overlayColor, overlayStrength * 0.7)} 0%, transparent 65%, ${previewColorWithOpacity(overlayColor, overlayStrength * 0.2)} 100%)`,
    };
    const primaryButtonStyle = {
      display: "inline-block",
      padding: "12px 20px",
      borderRadius: 6,
      background: textColor,
      color: backgroundColor,
      textDecoration: "none",
      fontWeight: 700,
    };
    const secondaryButtonStyle = {
      ...primaryButtonStyle,
      background: previewColorWithOpacity(backgroundColor, 0.15),
      color: textColor,
      border: `1px solid ${previewColorWithOpacity(textColor, 0.65)}`,
    };

    return h(
      "div",
      {
        style: {
          position: "relative",
          minHeight: 560,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          padding: "56px 7%",
          boxSizing: "border-box",
          backgroundColor,
          color: textColor,
          fontFamily: "Georgia, serif",
        },
      },
      previewVideo
        ? h("video", {
            src: previewVideo,
            poster: previewPoster,
            muted: true,
            autoPlay: true,
            loop: true,
            playsInline: true,
            style: mediaStyle,
          })
        : previewPoster
          ? h("img", { src: previewPoster, alt: "", style: mediaStyle })
          : null,
      h("div", { style: overlayStyle }),
      h(
        "div",
        {
          style: {
            position: "relative",
            zIndex: 1,
            maxWidth: 760,
            borderLeft: `3px solid ${get("accentBorderColor", "#d4b36a")}`,
            paddingLeft: 28,
          },
        },
        h(
          "p",
          {
            style: {
              color: get("accentColor", "#f1d99d"),
              font: "bold 12px Arial, sans-serif",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            },
          },
          get("eyebrow")
        ),
        h(
          "h1",
          {
            style: {
              fontSize: "clamp(32px, 5vw, 64px)",
              lineHeight: 1.08,
              margin: "24px 0",
            },
          },
          get("title")
        ),
        h(
          "p",
          { style: { font: "18px/1.6 Arial, sans-serif", maxWidth: 620 } },
          get("description")
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 28,
            },
          },
          h(
            "a",
            { href: get("primaryButtonUrl"), style: primaryButtonStyle },
            get("primaryButtonLabel")
          ),
          h(
            "a",
            { href: get("secondaryButtonUrl"), style: secondaryButtonStyle },
            get("secondaryButtonLabel")
          )
        ),
        h(
          "blockquote",
          {
            style: {
              margin: "48px 0 0",
              paddingTop: 16,
              borderTop: `1px solid ${previewColorWithOpacity(textColor, 0.3)}`,
              fontSize: 21,
              fontStyle: "italic",
            },
          },
          get("quote"),
          h(
            "footer",
            {
              style: {
                marginTop: 10,
                color: get("accentColor", "#f1d99d"),
                font: "bold 11px Arial, sans-serif",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              },
            },
            get("quoteAttribution")
          )
        )
      )
    );
  },
});

window.CMS.registerPreviewTemplate("hero_video", HeroPreview);
