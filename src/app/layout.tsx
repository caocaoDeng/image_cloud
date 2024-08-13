'use client'

import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/navigation'
import store from '@/store'
import { USERINFO } from '@/utils/const'
import '@/assets/iconfont/iconfont.css'
import './globals.scss'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()

  const permission = () => {
    const userInfo = localStorage.getItem(USERINFO)
    if (!userInfo) router.push('/login')
  }

  useEffect(() => {
    permission()
  }, [router])

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  )
}
