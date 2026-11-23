import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EventMedia } from "./EventMedia";

const event = {
  title: "Test Event",
  image: undefined,
  photos: [],
  gallery: [{ photo: "/uploads/test-photo.jpg", showInCarousel: true }],
};

describe("EventMedia", () => {
  it("shows carousel photos in the gallery when enabled", () => {
    const markup = renderToStaticMarkup(
      <EventMedia event={event} includeCarouselPhotosInGallery />
    );

    expect(
      markup.match(/<img[^>]*src="\/uploads\/test-photo\.jpg"/g)
    ).toHaveLength(2);
  });

  it("keeps carousel photos out of the gallery by default", () => {
    const markup = renderToStaticMarkup(<EventMedia event={event} />);

    expect(
      markup.match(/<img[^>]*src="\/uploads\/test-photo\.jpg"/g)
    ).toHaveLength(1);
  });
});
