import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State, Dispatch } from './index'
import api from '@/api'
import { ReposContent, Repository, User } from '@/api/interface'
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
      const { user, repository } = getState()
      const { login } = user.user as User
      const { name } = repository.repos as Repository
      const content = await api.getReposContent({
        owner: login,
        repo: name,
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

export type CreateType = 'dir' | 'file'

export const createReposContent = (
  { path, content }: CreateRepoParams,
  type: CreateType
) => {
  const fullPath = `${BASE_PATH}/${path}`
  return async (dispatch: Dispatch, getState: () => State) => {
    const { user, repository } = getState()
    const { login, name, email } = user.user as User
    const { name: repoName } = repository.repos as Repository
    const res = await api.updateReposContent({
      owner: login,
      repo: repoName,
      path: fullPath,
      content,
      committer: { name, email },
    })
    const repoC =
      type === 'dir'
        ? {
            ...res.content,
            name: path.replace(/\/.*/, ''),
            type: 'dir',
          }
        : res.content
    dispatch(setContent([repoC]))
  }
}

export default repositorySlice.reducer
