// App.tsx
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch, useLocation, useParams } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { InterestSignupProvider } from "./contexts/InterestSignupContext";

import Home from "./pages/Home";
import About from "./pages/About";
import Announcements from "./pages/Announcements";
import OpportunityDetail from "./pages/OpportunityDetail";
import FaithFormation from "./pages/FaithFormation";
import StaffDetail from "./pages/StaffDetail";
import FaithFormationDetail from "./pages/FaithFormationDetail";
import ConnectGroupsPage from "./pages/ConnectGroupsPage";
import GroupStudiesPage from "./pages/GroupStudiesPage";
import LiturgyPage from "./pages/LiturgyPage";
import NeedHelp from "./pages/NeedHelp";
import Contribute from "./pages/Contribute";
import FeedbackButton from "./components/FeedbackButton";

import Bulletin from "./components/Bulletin";
import PreviousBulletins from "./components/PreviousBulletins";
import NextWeekBulletin from "./components/NextWeekBulletin";
import UpcomingEventsCalendar from "./components/UpcomingEventsCalendar";
import EventDetail from "./pages/EventDetail";

import WednesdaySupper from "./components/WednesdaySupper";
import KnightsOfColumbus from "./components/KnightsOfColumbus";
import AltarSociety from "./components/AltarSociety";

import Sacraments from "./pages/Sacraments";
import Resources from "./pages/Resources";
import NewToStTherese from "./pages/NewToStTherese";

function LegacyOpportunityRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Redirect to={`/${id}`} />;
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
      <Route path={"/announcements"} component={Announcements} />
      <Route
        path={"/get-involved"}
        component={() => <Redirect to="/contribute" />}
      />
      <Route path={"/get-involved/:id"} component={LegacyOpportunityRedirect} />
      <Route
        path={"/st-vincent-de-paul"}
        component={() => <Redirect to="/st-vincent-de-paul-food-drive" />}
      />
      <Route path={"/supper-week"} component={WednesdaySupper} />
      <Route path={"/altar-society"} component={AltarSociety} />
      <Route path={"/knights-of-columbus"} component={KnightsOfColumbus} />
      <Route path={"/connect-groups"} component={ConnectGroupsPage} />
      <Route path={"/group-studies"} component={GroupStudiesPage} />
      <Route path={"/liturgy"} component={LiturgyPage} />
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
            <Router />
            <FeedbackButton />
          </InterestSignupProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
