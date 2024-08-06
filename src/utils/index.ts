import { LOGKEY } from './const'

// 读取文件，转base64
export const readFile2Base64 = (file: File): Promise<string> => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.addEventListener('load', (e: ProgressEvent<FileReader>) =>
      res(e.target?.result as string)
    )
    reader.addEventListener('error', rej)
    reader.addEventListener('abort', rej)
    reader.readAsDataURL(file)
  })
}

// 读取文件，转 ArrayBuffer
export const readFile2ArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.addEventListener('load', (e: ProgressEvent<FileReader>) =>
      res(e.target?.result as ArrayBuffer)
    )
    reader.addEventListener('error', rej)
    reader.addEventListener('abort', rej)
    reader.readAsArrayBuffer(file)
  })
}

export interface ImgOnloadInfo {
  width: number
  height: number
  message?: string
}

// 加载图片信息
export const getImageInfo = (data: File | string): Promise<ImgOnloadInfo> => {
  const src =
    typeof data === 'string' ? data : URL.createObjectURL(new Blob([data]))
  return new Promise<ImgOnloadInfo>((res, rej) => {
    const image = new Image()
    image.src = src
    image.onload = () => res({ width: image.width, height: image.height })
    image.onerror = () => rej({ message: '图片加载失败' })
    image.onabort = () => rej({ message: '图片加载失败' })
  }).finally(() => {
    URL.revokeObjectURL(src)
  })
}

export interface ImageInfo {
  width: number
  height: number
  // 图片上传成功返回的唯一字段
  sha: string
  style?: {
    width: string
    height: string
    transform: string
  }
}

export interface LogsData {
  sha: string
  content: ImageInfo[]
}

/**
 * 获取指定图片的信息
 * @param sha repos content 的唯一值
 */
export const getGivenImageInfo = (sha: string) => {
  const logsStr = localStorage.getItem(LOGKEY)
  if (!logsStr) return {}
  const { content }: LogsData = JSON.parse(logsStr)
  return content.find(({ sha: imgSha }) => imgSha === sha) || {}
}

/**
 * 下载函数
 * @param url 资源地址
 * @param name 文件名称
 */
export const download = (url: string, name: string) => {
  const tag_a = document.createElement('a')
  tag_a.setAttribute('href', url)
  tag_a.setAttribute('download', name)
  tag_a.click()
}
