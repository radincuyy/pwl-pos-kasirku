import type { ReactNode } from "react"

type SalesWorkspaceTemplateProps = {
  catalog: ReactNode
  checkout: ReactNode
  mobileCheckout: ReactNode
}

export function SalesWorkspaceTemplate({
  catalog,
  checkout,
  mobileCheckout,
}: SalesWorkspaceTemplateProps) {
  return (
    <div className="grid min-h-0 flex-1 gap-4 pb-20 lg:grid-cols-[minmax(0,1fr)_22rem] lg:pb-0 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="min-w-0">{catalog}</section>
      <aside className="hidden min-w-0 lg:sticky lg:top-4 lg:block lg:self-start lg:pt-12">
        {checkout}
      </aside>
      {mobileCheckout}
    </div>
  )
}
