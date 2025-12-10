import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStore } from "@/lib/store";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/auth";
import Home from "@/pages/home";
import Manage from "@/pages/manage";
import Settings from "@/pages/settings";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const isAuthenticated = useStore(state => state.isAuthenticated);
  return isAuthenticated ? <Component {...rest} /> : <Redirect to="/auth" />;
}

import LandingPage from "@/pages/landing";

function Router() {
  const isAuthenticated = useStore(state => state.isAuthenticated);

  return (
    <Switch>
      <Route path="/" component={LandingPage} />

      <Route path="/auth">
        {isAuthenticated ? <Redirect to="/app" /> : <Auth />}
      </Route>
      
      <Route path="/app">
        {isAuthenticated ? <Home /> : <Redirect to="/auth" />}
      </Route>
      
      <Route path="/manage">
        {isAuthenticated ? <Manage /> : <Redirect to="/auth" />}
      </Route>
      
      <Route path="/settings">
        {isAuthenticated ? <Settings /> : <Redirect to="/auth" />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
