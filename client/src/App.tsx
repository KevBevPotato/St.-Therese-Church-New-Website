// --- File: App.tsx ---
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

import Home from "./pages/Home";
import About from "./pages/About";
import GetInvolved from "./pages/GetInvolved";
import OpportunityDetail from "./pages/OpportunityDetail";
import FaithFormation from "./pages/FaithFormation";
import StaffDetail from "./pages/StaffDetail";  // ✅ ADDED

import Bulletin from "./components/Bulletin";
import PreviousBulletins from "./components/PreviousBulletins";
import NextWeekBulletin from "./components/NextWeekBulletin";
import UpcomingEventsCalendar from "./components/UpcomingEventsCalendar"; 
import EventDetail from "./pages/EventDetail";

import WednesdaySupper from "./components/WednesdaySupper";
import KnightsOfColumbus from "./components/KnightsOfColumbus";
import AltarSociety from "./components/AltarSociety";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/get-involved"} component={GetInvolved} />
      <Route path={"/get-involved/supper-week"} component={WednesdaySupper} />
      <Route path={"/get-involved/altar-society"} component={AltarSociety} />
      <Route path={"/get-involved/knights-of-columbus"} component={KnightsOfColumbus} />
      <Route path={"/get-involved/:id"} component={OpportunityDetail} />
      <Route path={"/faith-formation"} component={FaithFormation} />
      <Route path={"/staff/:slug"} component={StaffDetail} />  {/* ✅ ADDED */}
      
      <Route path={"/bulletin"} component={Bulletin} />
      <Route path={"/bulletin/previous"} component={PreviousBulletins} />
      <Route path={"/bulletin/next"} component={NextWeekBulletin} />
      
      <Route path={"/events"} component={UpcomingEventsCalendar} />
      <Route path={"/events/:id"} component={EventDetail} />

      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
