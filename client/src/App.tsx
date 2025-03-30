import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import Dashboard from "@/pages/Dashboard";
import Invoices from "@/pages/Invoices";
import InvoiceDetails from "@/pages/InvoiceDetails";
import AIAssistant from "@/pages/AIAssistant";
import Vendors from "@/pages/Vendors";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";

function NotFound() {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900">404 Page Not Found</h2>
        <p className="mt-2 text-gray-500">Did you forget to add the page to the router?</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/invoices" component={Invoices} />
      <Route path="/invoices/:invoiceNum" component={InvoiceDetails} />
      <Route path="/ai-assistant" component={AIAssistant} />
      <Route path="/vendors" component={Vendors} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 overflow-auto">
          <Router />
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
