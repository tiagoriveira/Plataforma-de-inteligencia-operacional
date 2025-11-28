import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AssetsList from "./pages/AssetsList";
import AssetDetail from "./pages/AssetDetail";
import Scanner from "./pages/Scanner";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";
import QuickEvent from "./pages/QuickEvent";
import NewAsset from "./pages/NewAsset";
import PrintLabel from "./pages/PrintLabel";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/assets"} component={AssetsList} />
      <Route path={"/assets/new"} component={NewAsset} />
      <Route path={"/assets/:id/print"} component={PrintLabel} />
      <Route path={"/assets/:id"} component={AssetDetail} />
      <Route path={"/scan"} component={Scanner} />
      <Route path={"/maintenance"} component={Maintenance} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/quick-event"} component={QuickEvent} />
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
        defaultTheme="dark"
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
