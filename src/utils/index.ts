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
