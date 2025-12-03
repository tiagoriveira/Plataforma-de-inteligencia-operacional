import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import AssetsList from "./pages/AssetsList";
import AssetDetail from "./pages/AssetDetail";
import Scanner from "./pages/Scanner";
import AuditLog from "./pages/AuditLog";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import QuickEvent from "./pages/QuickEvent";
import NewAsset from "./pages/NewAsset";
import PrintLabel from "./pages/PrintLabel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

function PrivateRoute({ component: Component, ...rest }: any) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return user ? <Component {...rest} /> : <Redirect to="/login" />;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />

      {/* Private routes */}
      <Route path="/">
        {() => <PrivateRoute component={Home} />}
      </Route>
      <Route path="/assets">
        {() => <PrivateRoute component={AssetsList} />}
      </Route>
      <Route path="/assets/new">
        {() => <PrivateRoute component={NewAsset} />}
      </Route>
      <Route path="/assets/:id/print">
        {(params) => <PrivateRoute component={PrintLabel} params={params} />}
      </Route>
      <Route path="/assets/:id">
        {(params) => <PrivateRoute component={AssetDetail} params={params} />}
      </Route>
      <Route path="/scan">
        {() => <PrivateRoute component={Scanner} />}
      </Route>
      <Route path="/audit-log">
        {() => <PrivateRoute component={AuditLog} />}
      </Route>
      <Route path="/settings">
        {() => <PrivateRoute component={Settings} />}
      </Route>
      <Route path="/reports">
        {() => <PrivateRoute component={Reports} />}
      </Route>
      <Route path="/quick-event">
        {() => <PrivateRoute component={QuickEvent} />}
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
