import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State, Dispatch } from './index'
import api from '@/api'
import { ReposContent, Repository } from '@/api/interface'
import { BASE_PATH } from '@/utils/const'

interface InitialState {
  repository: Repository | null | undefined
  content: ReposContent[]
}

const initialState: InitialState = {
  repository: undefined,
  content: [],
}

export const repositorySlice = createSlice({
  name: 'repository',
  initialState,
  reducers: {
    setRepository(state, { payload }: PayloadAction<Repository>) {
      state.repository = payload
    },

    setContent(state, { payload }: PayloadAction<ReposContent[]>) {
      state.content = [...payload, ...state.content]
    },
  },
})

export const { setRepository, setContent } = repositorySlice.actions

// 查询repos
export const fetchUserRepository = () => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const { user } = getState()
    const username = user.user?.login || ''
    // let reops = `${username}.github.io`
    let reops = `api-test`
    const r = await api.getUserRepositories({ username })
    const qReops = r.find((repository) => repository.name === reops)
    // 存在直接设置repos，不存在创建之后再设置repos
    qReops
      ? await dispatch(setRepository(qReops))
      : await dispatch(createRepos())
    dispatch(fetchReposContent())
  }
}

// 创建 repos
export const createRepos = () => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const repos = await api.createRepository({ name: 'api-test' })
    dispatch(setRepository(repos))
  }
}

export const fetchReposContent = () => {
  return async (dispatch: Dispatch, getState: () => State) => {
    try {
      const content = await api.getReposContent({ path: BASE_PATH })
      dispatch(setContent(content))
    } catch (error) {
      // TODO 调整接口封装
      // 未查询到 初始化
      dispatch(createReposContent({ path: 'log.json', content: '' }))
    }
  }
}

export interface CreateRepoParams {
  path: string
  content: string
}

export const createReposContent = ({ path, content }: CreateRepoParams) => {
  path = `${BASE_PATH}/${path}`
  return async (dispatch: Dispatch, getState: () => State) => {
    const r = api.updateReposContent({ path, content })
  }
}

export default repositorySlice.reducer
