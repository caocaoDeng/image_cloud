import request from '@/utils/request'
import store from '@/store'
import {
  User,
  IRepositoriesParams,
  Repository,
  CreateReposParams,
  RepoContent,
  ReposContent,
} from './interface'

const api = {
  // 获取用户信息
  getUserInfo() {
    return request<User>('GET', '/user')
  },

  // 获取repos列表
  getUserRepositories(params: IRepositoriesParams) {
    return request<Repository[]>(
      'GET',
      `/users/${params.username}/repos`,
      params
    )
  },

  // 创建repo
  createRepository(params: CreateReposParams) {
    return request<Repository>('POST', '/user/repos', params)
  },

  // 获取repo内容
  getReposContent({ path }: { path: string }) {
    const { user, repository } = store.getState()
    const { login } = user.user as User
    const { name: repoName } = repository.repository as Repository
    return request<ReposContent[]>(
      'GET',
      `/repos/${login}/${repoName}/contents/${path}`
    )
  },

  // 更新内容
  updateReposContent(params: RepoContent) {
    const { user, repository } = store.getState()
    const { login, name, email } = user.user as User
    const { name: repoName } = repository.repository as Repository
    params = {
      owner: login,
      repo: repoName,
      message: 'update resourse',
      committer: {
        name: name,
        email: email,
      },
      ...params,
    }
    return request<RepoContent>(
      'PUT',
      `/repos/${login}/${repoName}/contents/${params.path}`,
      params
    )
  },
}

export default api
