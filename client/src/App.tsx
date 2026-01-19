import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminProvider } from "@/lib/admin";
import { AdminGuard } from "@/components/AdminGuard";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import History from "@/pages/History";
import AddData from "@/pages/AddData";
import Players from "@/pages/Players";
import MonthlyStats from "@/pages/MonthlyStats";
import HeadToHead from "@/pages/HeadToHead";
import PlayerProfile from "@/pages/PlayerProfile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/history">
        <AdminGuard>
          <History />
        </AdminGuard>
      </Route>
      <Route path="/add">
        <AdminGuard>
          <AddData />
        </AdminGuard>
      </Route>
      <Route path="/players">
        <AdminGuard>
          <Players />
        </AdminGuard>
      </Route>
      <Route path="/monthly" component={MonthlyStats} />
      <Route path="/h2h" component={HeadToHead} />
      <Route path="/player/:id" component={PlayerProfile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AdminProvider>
    </QueryClientProvider>
  );
}

export default App;
