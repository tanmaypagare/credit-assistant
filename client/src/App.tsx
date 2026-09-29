import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import Profile from "@/pages/Profile";
import Recommendations from "@/pages/Recommendations";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/onboarding" component={Onboarding} /><Route path="/dashboard" component={Dashboard} /><Route path="/profile" component={Profile} /><Route path="/recommendations" component={Recommendations} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
