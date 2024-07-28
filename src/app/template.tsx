'use client'

import { Provider } from 'react-redux'
import store from '@/store'
import React from 'react'

export default function Template({ children }: { children: React.ReactNode }) {

  return (
    <React.Fragment>
      <Provider store={store}>{children}</Provider>
    </React.Fragment>
  )
}
