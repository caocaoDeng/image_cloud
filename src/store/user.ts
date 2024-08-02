import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State, Dispatch } from './index'
import { USERINFO } from '@/utils/const'
import api from '@/api'
import { User } from '@/api/interface'

export interface InitialState {
  auth_token: string
  user: User | null
}

export const initialState: InitialState = {
  auth_token: '',
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthToken: (state, { payload }: PayloadAction<string>) => {
      state.auth_token = payload
    },

    setUserInfo: (state, { payload }: PayloadAction<User>) => {
      state.user = payload
    },
  },
})

export const { setAuthToken, setUserInfo } = userSlice.actions

// 异步Thunk
export const fetchUserInfo = () => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const { user } = getState()
    const r = await api.getUserInfo()
    const userInfo: InitialState = {
      ...user,
      user: r,
    }
    const us = JSON.stringify(userInfo)
    localStorage.setItem(USERINFO, us)
    dispatch(setUserInfo(r))
  }
}

export default userSlice.reducer
