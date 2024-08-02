import { Octokit } from 'octokit'
import { RequestMethod } from '@octokit/types'
import { InitialState } from '@/store/user'
import { USERINFO } from './const'

const config = {
  accept: 'application/vnd.github+json',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28',
  },
}

/**
 * 初始化请求实例，并挂载到全局
 * @param auth github auth
 * @returns Octokit
 */
export const initOctokit = (auth?: string): Octokit => {
  const userInfo = localStorage.getItem(USERINFO)
  const { auth_token } = JSON.parse(userInfo || '{}') as InitialState
  const octokit = new Octokit({
    auth: auth || atob(auth_token),
    userAgent: 'image_cloud/v1.2.3',
  })
  window.octokit = octokit
  return octokit
}

// 扩展window对象
declare global {
  interface Window {
    octokit: Octokit
  }
}

function request<T>(
  method: RequestMethod,
  url: string,
  params?: object
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      const octokit = window.octokit || initOctokit()
      const r = await octokit.request(`${method} ${url}`, {
        ...config,
        ...(params || {}),
      })
      resolve(r.data)
    } catch (error: any) {
      reject(error)
      console.log(error.message)
    }
  })
}

export default request
