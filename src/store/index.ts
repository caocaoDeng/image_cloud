import { configureStore } from '@reduxjs/toolkit'
import userReducer, { initialState } from './user'
import repositoryReducer from './repository'
import { USERINFO } from '@/utils/const'

export const store = configureStore({
  reducer: {
    user: userReducer,
    repository: repositoryReducer,
  },
})

store.subscribe(() => {
  const { user } = store.getState()
  const userInfo = JSON.stringify(user || initialState)
  localStorage.setItem(USERINFO, userInfo)
})

// https://redux.js.org/tutorials/typescript-quick-start
export type State = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch

export default store
