import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const [location] = useLocation();
  const [isCompressed, setIsCompressed] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 transition-all duration-300 ease-in-out z-10 bg-slate-800 text-white pt-16 lg:pt-0 h-screen lg:h-auto overflow-y-auto",
        open ? "translate-x-0" : "-translate-x-full",
        isCompressed ? "w-20" : "w-64"
      )}
    >
      <button
        onClick={() => setIsCompressed(!isCompressed)}
        className="absolute right-0 top-2 p-2 hover:bg-slate-700 rounded-l-md transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isCompressed ? (
            <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
          ) : (
            <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
          )}
        </svg>
      </button>

      <div className={cn(
        "px-4 py-8 border-b border-slate-700 flex justify-center items-center",
        isCompressed && "px-2 py-4"
      )}>
        <h1 
          className={cn(
            "font-bold text-white cursor-pointer hover:text-blue-400 transition-colors tracking-tight text-center",
            isCompressed ? "text-2xl" : "text-4xl"
          )}
          onClick={() => window.location.href = "/"}
        >
          {isCompressed ? "IT" : "InvoTech"}
        </h1>
      </div>
      <nav className={cn("mt-5", isCompressed ? "px-1" : "px-2")}>
        <div
          className={cn(
            "group flex items-center py-3 text-sm font-medium rounded-md mb-1 cursor-pointer",
            isCompressed ? "px-2 justify-center" : "px-4",
            isActive("/") ? "bg-slate-700" : "hover:bg-slate-700"
          )}
          onClick={() => window.location.href = "/"}
          title="Dashboard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-5 w-5", !isCompressed && "mr-3")}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          {!isCompressed && "Dashboard"}
        </div>
        <div
          className={cn(
            "group flex items-center py-3 text-sm font-medium rounded-md mb-1 cursor-pointer",
            isCompressed ? "px-2 justify-center" : "px-4",
            isActive("/invoices") ? "bg-slate-700" : "hover:bg-slate-700"
          )}
          onClick={() => window.location.href = "/invoices"}
          title="Invoices"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-5 w-5", !isCompressed && "mr-3")}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          {!isCompressed && "Invoices"}
        </div>
        <div
          className={cn(
            "group flex items-center py-3 text-sm font-medium rounded-md mb-1 cursor-pointer",
            isCompressed ? "px-2 justify-center" : "px-4",
            isActive("/vendors") ? "bg-slate-700" : "hover:bg-slate-700"
          )}
          onClick={() => window.location.href = "/vendors"}
          title="Vendors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-5 w-5", !isCompressed && "mr-3")}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          {!isCompressed && "Vendors"}
        </div>
        <div
          className={cn(
            "group flex items-center py-3 text-sm font-medium rounded-md mb-1 cursor-pointer",
            isCompressed ? "px-2 justify-center" : "px-4",
            isActive("/ai-assistant") ? "bg-slate-700" : "hover:bg-slate-700"
          )}
          onClick={() => window.location.href = "/ai-assistant"}
          title="AI Assistant"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-5 w-5", !isCompressed && "mr-3")}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          {!isCompressed && "AI Assistant"}
        </div>
        <div
          className={cn(
            "group flex items-center py-3 text-sm font-medium rounded-md mb-1 cursor-pointer",
            isCompressed ? "px-2 justify-center" : "px-4",
            isActive("/settings") ? "bg-slate-700" : "hover:bg-slate-700"
          )}
          onClick={() => window.location.href = "/settings"}
          title="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn("h-5 w-5", !isCompressed && "mr-3")}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          {!isCompressed && "Settings"}
        </div>
      </nav>
      {!isCompressed && (
        <div className="px-4 mt-8">
          <div className="px-4 py-4 bg-slate-700 rounded-lg">
            <h3 className="text-sm font-medium text-white">Need Help?</h3>
            <p className="mt-1 text-xs text-slate-300">
              Contact support for assistance with invoice management.
            </p>
            <button className="mt-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
              Contact Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
