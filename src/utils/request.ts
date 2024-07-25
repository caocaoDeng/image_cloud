import { Octokit } from 'octokit'
import { RequestMethod } from '@octokit/types'

const config = {
  accept: 'application/vnd.github+json',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28',
  },
}

// 初始化请求实例
const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_AUTH_TOKEN,
  userAgent: 'image_cloud/v1.2.3',
})

function request<T>(
  method: RequestMethod,
  url: string,
  params?: object
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
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
