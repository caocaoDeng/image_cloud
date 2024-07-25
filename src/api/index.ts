import request from '@/utils/request'

export interface User {
  id: number
  location: string
  login: string
  name: string
  email: string
  bio: string
  avatar_url: string
  html_url: string
}

export interface IRepositoriesParams {
  username: string
}

export interface Repository {
  name: string
}

export default {
  getUserInfo() {
    return request<User>('GET', '/user')
  },
  getUserRepositories(params: IRepositoriesParams) {
    return request<Repository[]>(
      'GET',
      `/users/${params.username}/repos`,
      params
    )
  },
}
