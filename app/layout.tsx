import './globals.css'
import { DM_Sans } from 'next/font/google'

const dm = DM_Sans({ subsets: ['latin'], weight: ['400','500','600','700'] })

export const metadata = {
  title: 'Scaler Persona Chat',
  description: 'Chat with Anshuman Singh, Kshitij Mishra, and Abhimanyu Saxena — persona-based AI chatbot',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dm.className} bg-[#FAFAFA]`}>{children}</body>
    </html>
  )
}
