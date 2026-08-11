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

// Bulletin pages live in ./components/ alongside your existing setup
import Bulletin from "./components/Bulletin";
import PreviousBulletins from "./components/PreviousBulletins";
import NextWeekBulletin from "./components/NextWeekBulletin";

// Make sure to adjust these import paths to match exactly where your files are located!
import UpcomingEventsCalendar from "./components/UpcomingEventsCalendar"; 
import EventDetail from "./pages/EventDetail";

// Wednesday Night Supper landing page
import WednesdaySupper from "./components/WednesdaySupper";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/get-involved"} component={GetInvolved} />
      {/* IMPORTANT: supper-week MUST come before :id so wouter matches the specific route first */}
      <Route path={"/get-involved/supper-week"} component={WednesdaySupper} />
      <Route path={"/get-involved/:id"} component={OpportunityDetail} />
      <Route path={"/faith-formation"} component={FaithFormation} />
      
      {/* Bulletin Routes */}
      <Route path={"/bulletin"} component={Bulletin} />
      <Route path={"/bulletin/previous"} component={PreviousBulletins} />
      <Route path={"/bulletin/next"} component={NextWeekBulletin} />
      
      {/* New Event Routes */}
      <Route path={"/events"} component={UpcomingEventsCalendar} />
      <Route path={"/events/:id"} component={EventDetail} />

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
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
