import type { ReactNode } from "react"

type SalesWorkspaceTemplateProps = {
  catalog: ReactNode
  checkout: ReactNode
}

export function SalesWorkspaceTemplate({
  catalog,
  checkout,
}: SalesWorkspaceTemplateProps) {
  return (
    <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="min-w-0">{catalog}</section>
      <aside className="min-w-0 xl:sticky xl:top-4 xl:self-start xl:pt-12">
        {checkout}
      </aside>
    </div>
  )
}
