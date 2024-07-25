import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State, Dispatch } from './index'
import api, { Repository } from '@/api'

interface InitialState {
  repository: Repository | null | undefined
  content: any
}

const initialState: InitialState = {
  repository: undefined,
  content: '',
}

export const repositorySlice = createSlice({
  name: 'repository',
  initialState,
  reducers: {
    setRepository(state, { payload }: PayloadAction<Repository | undefined>) {
      state.repository = payload
    },
  },
})

export const { setRepository } = repositorySlice.actions

export const fetchUserRepository = () => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const { user } = getState()
    const username = user.user?.login || ''
    const r = await api.getUserRepositories({ username })
    const rep = r.find(
      (repository) => repository.name === `${username}.github.io`
    )
    dispatch(setRepository(rep))
    console.log(getState().repository.repository)
  }
}

export default repositorySlice.reducer
