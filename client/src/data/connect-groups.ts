import connectGroupsPageData from "./connect-groups-page.json";
import { visibleContent } from "./visible-content";
import type { PotluckSignup } from "./potlucks";

export interface ConnectGroupsPageData {
  title: string;
  description: string;
  audienceHeading?: string;
  audienceItems: string[];
  contentBlocks: Array<{
    layout?: "card" | "full";
    heading?: string;
    body?: string;
    image?: string;
    imageAlt?: string;
    linkLabel?: string;
    linkUrl?: string;
  }>;
  gallery: Array<{
    photo: string;
    caption?: string;
    linkUrl?: string;
    showInCarousel?: boolean;
  }>;
  signUpLinks: Array<{ label: string; url: string }>;
  potlucks: PotluckSignup[];
}

const connectGroupsPage = visibleContent(connectGroupsPageData);

export default connectGroupsPage as ConnectGroupsPageData;
