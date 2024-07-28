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

export interface CreateReposParams {
  name: string
  description?: string
  private?: boolean
}

export interface Committer {
  name: string
  email: string
}

export interface RepoContent {
  // username
  owner?: string
  // 仓库名称
  repo?: string
  // 更新路径
  path: string
  // 提交信息
  message?: string
  // 提交内容 base64
  content: string
  // 提交人
  committer?: Committer
}

export interface ReposContent {
  name: string
  path: string
  sha: string
  type: string
  html_url: string
  download_url: string
}
