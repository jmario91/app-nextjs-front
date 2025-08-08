import 'bootstrap/dist/css/bootstrap.min.css'
import { ReactNode } from 'react'
import Navbar from '../components/Navbar'
import ApolloWrapper from '../lib/apollo-provider'
import "../styles/global.css"

export const metadata = {
  title: 'Aplicación Mario Perez Nextjs',
  description: 'Sistema moderno de usuarios con Next.js + GraphQL + Bootstrap',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
        />
      </head>
      <body className="bg-light d-flex flex-column min-vh-100">
        <ApolloWrapper>
          <Navbar />
          <main className="container py-4 flex-grow-1">
            {children}
          </main>
          <footer className="bg-dark text-white text-center py-3">
            <small>© {new Date().getFullYear()} App Mario · Todos los derechos reservados</small>
          </footer>
        </ApolloWrapper>
      </body>
    </html>
  )
}
