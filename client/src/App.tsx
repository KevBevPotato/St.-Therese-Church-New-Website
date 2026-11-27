// App.tsx
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import NotFound from "@/pages/NotFound";
import {
  Redirect,
  Route,
  Router as WouterRouter,
  Switch,
  useLocation,
  useParams,
} from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { InterestSignupProvider } from "./contexts/InterestSignupContext";

import Home from "./pages/Home";
import About from "./pages/About";
import OpportunityDetail from "./pages/OpportunityDetail";
import FaithFormation from "./pages/FaithFormation";
import StaffDetail from "./pages/StaffDetail";
import FaithFormationDetail from "./pages/FaithFormationDetail";
import ConnectGroupsPage from "./pages/ConnectGroupsPage";
import LiturgyPage from "./pages/LiturgyPage";
const MassPage = lazy(() => import("./pages/MassPage"));
import GetInvolvedPage from "./pages/GetInvolvedPage";
import OrganizationsLandingPage from "./pages/OrganizationsLandingPage";
import NeedHelp from "./pages/NeedHelp";
import Contribute from "./pages/Contribute";
import FeedbackButton from "./components/FeedbackButton";

import Bulletin from "./components/Bulletin";
import PreviousBulletins from "./components/PreviousBulletins";
import NextWeekBulletin from "./components/NextWeekBulletin";
import UpcomingEventsCalendar from "./components/UpcomingEventsCalendar";
import EventDetail from "./pages/EventDetail";
import MonthlyCalendarArchive from "./pages/MonthlyCalendarArchive";
import KnightsNewsletterArchive from "./pages/KnightsNewsletterArchive";

import WednesdaySupper from "./components/WednesdaySupper";
import KnightsOfColumbus from "./components/KnightsOfColumbus";
import AltarSociety from "./components/AltarSociety";

import Sacraments from "./pages/Sacraments";
import Resources from "./pages/Resources";
import NewToStTherese from "./pages/NewToStTherese";

const spriteFusionProxyBase = "/p/https/www.stthereserapidcity.org";

function LegacyOpportunityRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Redirect to={`/${id}`} />;
}

function getRouterBase() {
  const { hostname, pathname } = window.location;
  return hostname === "destroy.spritefusion.com" &&
    (pathname === spriteFusionProxyBase ||
      pathname.startsWith(`${spriteFusionProxyBase}/`))
    ? spriteFusionProxyBase
    : undefined;
}

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/get-involved"} component={GetInvolvedPage} />
      <Route
        path={"/join-an-organization"}
        component={OrganizationsLandingPage}
      />
      <Route path={"/get-involved/:id"} component={LegacyOpportunityRedirect} />
      <Route
        path={"/st-vincent-de-paul"}
        component={() => <Redirect to="/st-vincent-de-paul-food-drive" />}
      />
      <Route path={"/supper-week"} component={WednesdaySupper} />
      <Route path={"/altar-society"} component={AltarSociety} />
      <Route path={"/knights-of-columbus"} component={KnightsOfColumbus} />
      <Route
        path={"/knights-of-columbus/newsletter-archive"}
        component={KnightsNewsletterArchive}
      />
      <Route path={"/connect-groups"} component={ConnectGroupsPage} />
      <Route path={"/liturgy"} component={LiturgyPage} />
      <Route
        path={"/mass"}
        component={() => (
          <Suspense fallback={null}>
            <MassPage />
          </Suspense>
        )}
      />
      <Route path={"/need-help"} component={NeedHelp} />
      <Route path={"/contribute"} component={Contribute} />
      <Route path={"/faith-formation"} component={FaithFormation} />
      <Route
        path="/faith-formation/:categoryId"
        component={FaithFormationDetail}
      />

      {/* ✅ Ensure this path matches the <Link href={`/staff/${member.slug}`}> in About.tsx */}
      <Route path={"/staff/:slug"} component={StaffDetail} />

      <Route path={"/bulletin"} component={Bulletin} />
      <Route path={"/bulletin/previous"} component={PreviousBulletins} />
      <Route path={"/bulletin/next"} component={NextWeekBulletin} />

      <Route path={"/sacraments"} component={Sacraments} />
      <Route path={"/resources"} component={Resources} />
      <Route path={"/new-to-st-therese"} component={NewToStTherese} />

      <Route path={"/events"} component={UpcomingEventsCalendar} />
      <Route
        path="/events/wednesday-faith-formation"
        component={FaithFormation}
      />
      <Route
        path="/events/wednesday-faith-formatioin"
        component={() => <Redirect to="/events/wednesday-faith-formation" />}
      />
      <Route path={"/calendar/archive"} component={MonthlyCalendarArchive} />
      <Route path={"/events/:id"} component={EventDetail} />

      <Route path={"/404"} component={NotFound} />
      <Route path={"/:id"} component={OpportunityDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <InterestSignupProvider>
            <Toaster />
            <WouterRouter base={getRouterBase()}>
              <Router />
            </WouterRouter>
            <FeedbackButton />
          </InterestSignupProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
