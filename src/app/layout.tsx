import './globals.css'
import Head from 'next/head'
import { Ga } from '@/components/Ga'

export const metadata = {
  title: '工数管理システムMU',
  description: 'Powered by Next.js, TypeScript, and Tailwind CSS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <Head>
        <Ga />
        <title>工数管理システムMU</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        {/* beautiful h1 */}
        <header className="w-full flex justify-center align-center bg-primary-100 p-3">
          <a href="./" rel="noopener noreferrer"  className="bg-white">
            <h1 className="m-4 text-4xl font-bold text-center text-primary-800">工数管理システムMU</h1>
          </a>
        </header>
        <main>
          {children}
        </main>
        <footer className="w-full flex justify-center align-center">
          <a href="./" rel="noopener noreferrer">
            Powered by <img src="./enoatu.svg" alt="Enoatu Logo" className="w-20" />
          </a>
        </footer>
      </body>
    </html>
  )
}
