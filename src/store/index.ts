import { configureStore } from '@reduxjs/toolkit'
import userReducer, { initialState } from './user'
import repositoryReducer from './repository'
import configReducer from './config'

export const store = configureStore({
  reducer: {
    user: userReducer,
    repository: repositoryReducer,
    config: configReducer,
  },
})

// https://redux.js.org/tutorials/typescript-quick-start
export type State = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch

export default store
