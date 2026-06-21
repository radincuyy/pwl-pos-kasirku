import { ImageIcon } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"

type ProductThumbnailProps = {
  src: string | null
  alt: string
  size: "small" | "catalog"
}

export function ProductThumbnail({
  src,
  alt,
  size,
}: ProductThumbnailProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  const showImage = Boolean(src && failedSource !== src)

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden bg-muted text-muted-foreground",
        size === "small" && "size-10 rounded-md border",
        size === "catalog" && "aspect-[4/3] w-full",
        size === "catalog" && showImage && "bg-white"
      )}
    >
      {showImage ? (
        <img
          src={src ?? undefined}
          alt={alt}
          className={cn(
            "size-full",
            size === "small" ? "object-cover" : "object-contain"
          )}
          loading="lazy"
          onError={() => setFailedSource(src)}
        />
      ) : (
        <ImageIcon
          className={cn(
            "opacity-60",
            size === "small" ? "size-4" : "size-8"
          )}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
