import Image from 'next/image'
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { readFile2ArrayBuffer } from '@/utils'
import Popover from '@/components/Popover'
import Upload, { IUploadEmitEvent } from '@/components/Upload'

export interface UploadImgPopEmitEvent {
  setVisible: Dispatch<SetStateAction<boolean>>
}
export interface LocalImgData {
  name: string
  type: string
  base64: string
}

export default forwardRef(function UploadImgPop(
  props,
  ref: React.ForwardedRef<UploadImgPopEmitEvent>
) {
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
      data.push({
        name: f.name,
        type: f.type,
        base64,
      })
    }
    setLocalImgData((preData) => [...data, ...preData])
  }

  return (
    <Popover title="上传图片" visible={visible} onClose={setVisible}>
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
