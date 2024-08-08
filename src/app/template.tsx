'use client'

import React from 'react'
import { Provider } from 'react-redux'
import store from '@/store'
import { setIsMobile } from '@/store/config'
import { getDevice } from '@/utils'

export default function Template({ children }: { children: React.ReactNode }) {
  // 初始化设备
  store.dispatch(setIsMobile(!!getDevice()))

  return <Provider store={store}>{children}</Provider>
}
