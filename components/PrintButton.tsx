// components/PrintButton.tsx
'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="border rounded-xl px-3 py-2 print:hidden"
      title="Print this page"
    >
      Print
    </button>
  )
}
