import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State, Dispatch } from './index'
import api from '@/api'
import { ReposContent, Repository, User } from '@/api/interface'

export interface InitialState {
  repos: Repository | null | undefined
  content: ReposContent[]
}

export type ContentAction = 'replace' | 'push'

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

    setContent(
      state,
      action: PayloadAction<{
        actionType?: ContentAction
        content: ReposContent[]
      }>
    ) {
      const { actionType = 'push', content } = action.payload
      switch (actionType) {
        case 'push':
          state.content = [...content, ...state.content]
          break

        case 'replace':
          state.content = [...content]
          break

        default:
          break
      }
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
    return r.find((repos) => repos.name === reops)
  }
}

// 创建 repos
export const createRepos = () => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const { user } = getState()
    const username = user.user?.login || ''
    let reops = `${username}.github.io`
    return await api.createRepository({ name: reops })
  }
}

/**
 * 获取 repos 某路径下的内容
 * @param path 路径
 * @returns repos content
 */
export const fetchReposContent = (path?: string) => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const { user, repository, config } = getState()
    const { login } = user.user as User
    const { name } = repository.repos as Repository
    const fullPath = config.entryPath.join('') + (path ? `/${path}` : '')
    const reposContent = await api.getReposContent({
      owner: login,
      repo: name,
      path: fullPath,
    })
    return reposContent
  }
}

export interface CreateRepoParams {
  sha?: string
  path: string
  content: string
}

export const createReposContent = ({
  sha,
  path,
  content,
}: CreateRepoParams) => {
  return async (dispatch: Dispatch, getState: () => State) => {
    const { user, repository, config } = getState()
    const { login, name, email } = user.user as User
    const { name: repoName } = repository.repos as Repository
    const fullPath = config.entryPath.join('') + `/${path}`
    const res = await api.updateReposContent({
      sha,
      owner: login,
      repo: repoName,
      path: fullPath,
      content,
      committer: { name, email },
    })
    return res.content
  }
}

export default repositorySlice.reducer
