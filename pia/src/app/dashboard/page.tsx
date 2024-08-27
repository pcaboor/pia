'use client'

import Link from "next/link"
import {
  BookOpen,
  DatabaseZap,
  Home,
  Key,
  KeyRound,
  LineChart,
  Menu,
  Package,
  Package2,
  ShoppingCart,
  Store,
  User,
  Users,
  Wallet,
} from "lucide-react"


import { Button } from "@/components/ui/button"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import DashboardHome from "../../components/welcome"
import { useUserData } from "@/hook/useUserData"
import { useState } from "react"
import TeamsPage from "./team/page"
import ApiKeysPage from "./team/page"
import DocumentationMain from "@/components/documentationMain"
import Settings from "./settings/page"

export function Dashboard() {

  const { userData, loading } = useUserData();

  const [selectedDoc, setSelectedDoc] = useState("Dashboard");

  const renderContent = () => {
    switch (selectedDoc) {
      case "Docs1":
        return 
      case "APIkeys":
        return <ApiKeysPage/>
        case "APIStore":
        return 
        case "Pricing":
        return 
        case "Account":
          return <Settings/>
      case "Documentation":
        return <DocumentationMain/>
      case "Usage":
        return <div>Contenu Analytics</div>
      default:
        return <DashboardHome />;
    }
  };

  if (loading) {
    return 
    
  }
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden bg-muted/40 md:block " >
        <div className="flex h-full max-h-screen flex-col gap-2 ">
          <div className="flex-1">
          <nav className="grid items-start px-2 text-[12px] font-light lg:px-4  sticky top-0 z-50 pt-10">
              <Link
                href="#"
                onClick={() => setSelectedDoc("Dashboard")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  selectedDoc === "Dashboard" ? "bg-muted text-primary" : "text-muted-foreground"
                } transition-all hover:text-primary`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="#"
                onClick={() => setSelectedDoc("APIkeys")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  selectedDoc === "APIkeys" ? "bg-muted text-primary" : "text-muted-foreground"
                } transition-all hover:text-primary`}
              >
                <KeyRound className="h-4 w-4" />
                API keys
              </Link>
              <Link
                href="#"
                onClick={() => setSelectedDoc("APIStore")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  selectedDoc === "APIStore" ? "bg-muted text-primary" : "text-muted-foreground"
                } transition-all hover:text-primary`}
              >
                <Store className="h-4 w-4" />
                API Store
              </Link>
              <Link
                href="#"
                onClick={() => setSelectedDoc("Pricing")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  selectedDoc === "Pricing" ? "bg-muted text-primary" : "text-muted-foreground"
                } transition-all hover:text-primary`}
              >
                <Wallet className="h-4 w-4" />
                Pricing
              </Link>
              <Link
                href="#"
                onClick={() => setSelectedDoc("Documentation")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  selectedDoc === "Documentation" ? "bg-muted text-primary" : "text-muted-foreground"
                } transition-all hover:text-primary`}
              >
                <BookOpen className="h-4 w-4" />
                Documentation
              </Link>
              <Link
                href="#"
                onClick={() => setSelectedDoc("Usage")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  selectedDoc === "Usage" ? "bg-muted text-primary" : "text-muted-foreground"
                } transition-all hover:text-primary`}
              >
                <DatabaseZap className="h-4 w-4" />
                Usage
              </Link>
              <Link
                href="#"
                onClick={() => setSelectedDoc("Account")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  selectedDoc === "Account" ? "bg-muted text-primary" : "text-muted-foreground"
                } transition-all hover:text-primary`}
              >
                <User className="h-4 w-4" />
                Account
              </Link>            
            </nav>
          </div>
        
        </div>
      </div>
      <div className="flex flex-col">
        <header className="">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
            <nav className="grid items-start px-2 text-xs font-light lg:px-4">
              <Link
                href="#"
                onClick={() => setSelectedDoc("Dashboard")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  selectedDoc === "Dashboard" ? "bg-muted text-primary" : "text-muted-foreground"
                } transition-all hover:text-primary`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="#"
                onClick={() => setSelectedDoc("Docs1")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  selectedDoc === "Docs1" ? "bg-muted text-primary" : "text-muted-foreground"
                } transition-all hover:text-primary`}
              >
                <ShoppingCart className="h-4 w-4" />
                Docs1
              </Link>
              <Link
                href="#"
                onClick={() => setSelectedDoc("Docs2")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  selectedDoc === "Docs2" ? "bg-muted text-primary" : "text-muted-foreground"
                } transition-all hover:text-primary`}
              >
                <Package className="h-4 w-4" />
                Docs2
              </Link>
              <Link
                href="#"
                onClick={() => setSelectedDoc("Docs3")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  selectedDoc === "Docs3" ? "bg-muted text-primary" : "text-muted-foreground"
                } transition-all hover:text-primary`}
              >
                <Users className="h-4 w-4" />
                Docs3
              </Link>
              <Link
                href="#"
                onClick={() => setSelectedDoc("Analytics")}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  selectedDoc === "Analytics" ? "bg-muted text-primary" : "text-muted-foreground"
                } transition-all hover:text-primary`}
              >
                <LineChart className="h-4 w-4" />
                Analytics
              </Link>
            </nav>
             
            </SheetContent>
          </Sheet>     
        </header>
        <main className="">
         
          <div
            className="flex flex-1 items-center justify-center rounded-lg " x-chunk="dashboard-02-chunk-1"
          >
             {renderContent()}
          
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard