import type { ReactNode } from "react"
import { PlusIcon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type MasterPageLayoutProps = {
  title: string
  description: string
  addLabel: string
  searchValue: string
  searchPlaceholder: string
  message: string | null
  error: string | null
  children: ReactNode
  onAdd: () => void
  onSearchChange: (value: string) => void
}

export function MasterPageLayout({
  title,
  description,
  addLabel,
  searchValue,
  searchPlaceholder,
  message,
  error,
  children,
  onAdd,
  onSearchChange,
}: MasterPageLayoutProps) {
  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button onClick={onAdd}>
          <PlusIcon className="size-4" />
          {addLabel}
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="pl-8"
        />
      </div>

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {children}
    </div>
  )
}
