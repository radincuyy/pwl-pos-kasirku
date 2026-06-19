const PRINTING_CLASS_NAME = "receipt-printing"

export function printReceipt(): void {
  const cleanup = (): void => {
    document.body.classList.remove(PRINTING_CLASS_NAME)
  }

  document.body.classList.add(PRINTING_CLASS_NAME)
  window.addEventListener("afterprint", cleanup, { once: true })

  try {
    window.print()
  } catch (error) {
    cleanup()
    throw error
  }
}
