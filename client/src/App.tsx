import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import { Route, Router, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

// Secondary pages load on demand so the landing page stays light.
const MapPage = lazy(() => import("./pages/MapPage"));
const TripPlanner = lazy(() => import("./pages/TripPlanner"));
const Passport = lazy(() => import("./pages/Passport"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Episodes = lazy(() => import("./pages/Episodes"));
const Getaway = lazy(() => import("./pages/Getaway"));
const NotFound = lazy(() => import("./pages/NotFound"));

const TITLES: Record<string, string> = {
  "/": "Sullivan's Crossing – Nova Scotia Filming Locations Fan Guide",
  "/map": "Interactive Map · Sullivan's Crossing Fan Guide",
  "/trip": "Plan a Trip · Sullivan's Crossing Fan Guide",
  "/passport": "Fan Passport · Sullivan's Crossing Fan Guide",
  "/quiz": "Location Trivia · Sullivan's Crossing Fan Guide",
  "/episodes": "Episode Guide · Sullivan's Crossing Fan Guide",
  "/getaway": "Find Your Fan Getaway · Sullivan's Crossing Fan Guide",
};

// Start each page at the top and give it its own tab title.
function PageEffects() {
  const [rawLocation] = useLocation();
  // Prerendered pages are served from /map/ etc., so ignore a trailing slash.
  const location = rawLocation.replace(/\/+$/, "") || "/";
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = TITLES[location] ?? "Page not found · Sullivan's Crossing Fan Guide";
  }, [location]);
  return null;
}

function PageLoading() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "oklch(0.94 0.025 75)", color: "oklch(0.45 0.05 220)", fontFamily: "var(--font-display)", fontStyle: "italic" }}>
      ⚓ Loading…
    </div>
  );
}


// Vite's BASE_URL is "/" locally and "/<repo>/" on GitHub Pages; wouter wants it
// without the trailing slash.
const ROUTER_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function AppRouter() {
  return (
    <Router base={ROUTER_BASE}>
      <PageEffects />
      <Suspense fallback={<PageLoading />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/map"} component={MapPage} />
        <Route path={"/trip"} component={TripPlanner} />
        <Route path={"/passport"} component={Passport} />
        <Route path={"/quiz"} component={Quiz} />
        <Route path={"/episodes"} component={Episodes} />
        <Route path={"/getaway"} component={Getaway} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
      </Suspense>
    </Router>
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
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
