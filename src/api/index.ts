import request from '@/utils/request'
import {
  User,
  IRepositoriesParams,
  Repository,
  CreateReposParams,
  ReposContent,
  UpdateReposParams,
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
  getReposContent({ owner, repo, path }: UpdateReposParams) {
    return request<ReposContent[]>(
      'GET',
      `/repos/${owner}/${repo}/contents/${path}`
    )
  },

  // 更新内容
  updateReposContent(params: UpdateReposParams) {
    const { owner, repo, path } = params
    return request<{
      content: ReposContent
    }>('PUT', `/repos/${owner}/${repo}/contents/${path}`, {
      ...params,
      message: 'update resourse',
    })
  },
}

export default api
