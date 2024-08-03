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

export interface ImageInfo {
  width: number
  height: number
  message?: string
}

export const getImageInfo = (data: File | string): Promise<ImageInfo> => {
  const src =
    typeof data === 'string' ? data : URL.createObjectURL(new Blob([data]))
  return new Promise<ImageInfo>((res, rej) => {
    const image = new Image()
    image.src = src
    image.onload = () => res({ width: image.width, height: image.height })
    image.onerror = () => rej({ message: '图片加载失败' })
    image.onabort = () => rej({ message: '图片加载失败' })
  }).finally(() => {
    URL.revokeObjectURL(src)
  })
}
