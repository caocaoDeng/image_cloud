import { createSlice, GetState, PayloadAction } from '@reduxjs/toolkit'
import { State, Dispatch } from './index'
import api from '@/api'
import { User } from '@/api/interface'

export interface InitialState {
  user: User | null
}

const initialState: InitialState = {
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, { payload }: PayloadAction<User>) => {
      state.user = payload
    },
  },
})

export const { setUserInfo } = userSlice.actions

// 异步Thunk
export const fetchUserInfo = () => {
  return async (dispatch: Dispatch, getState: GetState<State>) => {
    const r = await api.getUserInfo()
    dispatch(setUserInfo(r))
  }
}

export default userSlice.reducer
