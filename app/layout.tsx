import './globals.css'
import Header from '@/lib/components/Header'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="max-w-3xl mx-auto">{children}</div>
      </body>
    </html>
  )
}
