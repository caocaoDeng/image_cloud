import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State, Dispatch } from './index'
import api from '@/api'
import { ReposContent, Repository } from '@/api/interface'
import { BASE_PATH } from '@/utils/const'

interface InitialState {
  repos: Repository | null | undefined
  content: ReposContent[]
}

const initialState: InitialState = {
  repos: undefined,
  content: [],
}

export const repositorySlice = createSlice({
  name: 'repository',
  initialState,
  reducers: {
    setRepos(state, { payload }: PayloadAction<Repository>) {
      state.repos = payload
    },

    setContent(state, { payload }: PayloadAction<ReposContent[]>) {
      state.content = [...payload, ...state.content]
    },
  },
})

export const { setRepos, setContent } = repositorySlice.actions

// 查询repos
export const fetchUserRepos = () => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const { user } = getState()
    const username = user.user?.login || ''
    let reops = `${username}.github.io`
    const r = await api.getUserRepositories({ username })
    const qReops = r.find((repos) => repos.name === reops)
    // 存在直接设置repos，不存在创建之后再设置repos
    qReops ? await dispatch(setRepos(qReops)) : await dispatch(createRepos())
  }
}

// 创建 repos
export const createRepos = () => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const { user } = getState()
    const username = user.user?.login || ''
    let reops = `${username}.github.io`
    const repos = await api.createRepository({ name: reops })
    dispatch(setRepos(repos))
  }
}

export const fetchReposContent = () => {
  return async (dispatch: Dispatch, getState: () => State) => {
    try {
      const {
        user: { user },
        repository: { repos },
      } = getState()
      const content = await api.getReposContent({
        owner: user?.login as string,
        repo: repos?.name as string,
        path: BASE_PATH,
      })
      dispatch(setContent(content))
    } catch (error) {
      console.log(error, 99)
      // TODO 调整接口封装
      // 未查询到 初始化
      // dispatch(createReposContent({ path: 'log.json', content: '' }))
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
    await api.updateReposContent({ path, content })
    await dispatch(fetchReposContent())
  }
}

export default repositorySlice.reducer
