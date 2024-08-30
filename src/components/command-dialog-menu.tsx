import * as React from "react"
import Link from 'next/link';
import {
  Calculator,
  Calendar,
  CreditCard,
  Home,
  Settings,
  Smile,
  Terminal,
  User,
  User2,
  Users2,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export function CommandDialogDemo() {
  const [open, setOpen] = React.useState(false)

  const handleItemClick = () => {
    setOpen(false)
  }

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
          <Link href="/dashboard" onClick={handleItemClick}>
            <CommandItem>
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </CommandItem>
            </Link>
            <Link href="/dashboard/settings" onClick={handleItemClick}>
              <CommandItem>
                <Terminal className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </CommandItem>
            </Link>
            <Link href="/dashboard/team" onClick={handleItemClick}>
              <CommandItem>
              <Users2 className="mr-2 h-4 w-4" />
              <span>Create a team</span>
              </CommandItem>
            </Link>
            <CommandItem>
              <Calculator className="mr-2 h-4 w-4" />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}