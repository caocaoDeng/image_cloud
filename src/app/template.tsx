'use client'

import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { useRouter } from 'next/navigation'
import store from '@/store'
import { USERINFO } from '@/utils/const'

export default function Template({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const permission = () => {
    const userInfo = localStorage.getItem(USERINFO)
    if (!userInfo) router.push('/login')
  }

  useEffect(() => {
    permission()
  }, [router])

  return <Provider store={store}>{children}</Provider>
}
