import Image from 'next/image'
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useAppDispatch } from '@/store/hooks'
import { createReposContent, setContent } from '@/store/repository'
import {
  getImageInfo,
  ImgOnloadInfo,
  ImageInfo,
  LogsData,
  readFile2ArrayBuffer,
} from '@/utils'
import { LOGFILENAME, LOGKEY } from '@/utils/const'
import { ReposContent } from '@/api/interface'
import Popover from '@/components/Popover'
import Upload, { IUploadEmitEvent } from '@/components/Upload'

export interface UploadImgPopEmitEvent {
  setVisible: Dispatch<SetStateAction<boolean>>
}
export interface LocalImgData {
  name: string
  type: string
  base64: string
  width: number
  height: number
}

export default forwardRef(function UploadImgPop(
  props,
  ref: React.ForwardedRef<UploadImgPopEmitEvent>
) {
  const dispath = useAppDispatch()

  const uploadElm = useRef<IUploadEmitEvent>(null)

  const [visible, setVisible] = useState<boolean>(false)
  const [localImgData, setLocalImgData] = useState<LocalImgData[]>([])

  useImperativeHandle(
    ref,
    () => ({
      setVisible,
    }),
    []
  )

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files as FileList
    const data: LocalImgData[] = []
    for (const f of fileList) {
      const arrayBuffer = await readFile2ArrayBuffer(f)
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const { width, height } = (await getImageInfo(
        `data:${f.type};base64,${base64}`
      )) as ImgOnloadInfo
      data.push({
        name: f.name,
        type: f.type,
        base64,
        width,
        height,
      })
    }
    setLocalImgData((preData) => [...data, ...preData])
  }

  // 更新日志文件
  const updateLogs = async (logs: ImageInfo[]) => {
    const logsStr = localStorage.getItem(LOGKEY)
    const { sha, content = [] }: LogsData = JSON.parse(logsStr || '{}')
    const updatedContent = [...logs, ...content]
    const base64 = btoa(JSON.stringify(updatedContent))
    localStorage.setItem(
      LOGKEY,
      JSON.stringify({
        sha,
        content: updatedContent,
      })
    )
    // TODO 替换新的日志内容
    await dispath(
      createReposContent({ sha, path: LOGFILENAME, content: base64 })
    )
  }

  const handleClose = () => {
    setLocalImgData([])
    setVisible(false)
  }

  const handleSubmit = async () => {
    if (!localImgData) return
    const waitQueue = localImgData.map(({ name, base64, width, height }) => {
      return new Promise<{
        width: number
        height: number
        content: ReposContent
      }>(async (resolve) => {
        const content = await dispath(
          createReposContent({ path: name, content: base64 })
        )
        resolve({ width, height, content })
      })
    })
    const result = await Promise.all(waitQueue)
    const logs: ImageInfo[] = result.map(({ width, height, content }) => ({
      width,
      height,
      sha: content.sha,
    }))
    const reposContent = result.map((item) => item.content)
    // 更新日志文件
    await updateLogs(logs)
    await dispath(setContent({ content: reposContent }))
    handleClose()
  }

  return (
    <Popover
      title="上传图片"
      visible={visible}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <div className="flex">
        <Upload ref={uploadElm} className="flex-1" onChange={handleChange}>
          <div
            className="flex flex-col items-center justify-center w-full h-72 border border-dashed border-slate-300 rounded cursor-pointer hover:border-slate-800"
            onClick={() => uploadElm.current?.click()}
          >
            <i
              className="iconfont icon-tuya- leading-none text-slate-300 hover:text-slate-500"
              style={{ fontSize: '64px' }}
            ></i>
            <span className="text-slate-300">选择文件</span>
          </div>
        </Upload>
        <ul className="w-48 pl-3">
          {localImgData.map(({ type, name, base64 }) => (
            <li key={base64.slice(-6)} className="flex items-center mb-2">
              <div className="w-8 h-8 object-contain">
                <Image
                  className="w-full h-full"
                  src={`data:${type};base64,${base64}`}
                  width={32}
                  height={32}
                  alt="img"
                />
                {/* todo 鼠标hover显示删除icon */}
              </div>
              <p className="flex-1 w-0 ml-2 truncate">{name}</p>
            </li>
          ))}
        </ul>
      </div>
    </Popover>
  )
})
