import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user'
import repositoryReducer from './repository'

export const store = configureStore({
  reducer: {
    user: userReducer,
    repository: repositoryReducer,
  },
})

// https://redux.js.org/tutorials/typescript-quick-start
export type State = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch

export default store
