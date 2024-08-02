// 用户信息
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

// 获取 repos 的参数
export interface IRepositoriesParams {
  username: string
}

// repos 信息
export interface Repository {
  name: string
}

// 创建 repos 的参数
export interface CreateReposParams {
  name: string
  description?: string
  private?: boolean
}

// 获取 repos 返回的信息
export interface ReposContent {
  name: string
  path: string
  sha: string
  type: string
  html_url: string
  download_url: string
}

export interface Committer {
  name: string
  email: string
}

/**
 * 更新/获取 repos content 的参数
 * 更新时 content committer 必传
 */
export interface UpdateReposParams {
  // username
  owner: string
  // 仓库名称
  repo: string
  // 更新路径
  path: string
  // 提交信息
  message?: string
  // 提交内容 base64
  content?: string
  // 提交人
  committer?: Committer
}
