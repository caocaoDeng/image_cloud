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
    const data = []
    for (const f of fileList) {
      const arrayBuffer = await readFile2ArrayBuffer(f)
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      data.push({
        name: f.name,
        type: f.type,
        base64,
      })
    }
    setLocalImgData(data)
  }

  return (
    <Popover visible={visible} onClose={setVisible}>
      <div className="flex">
        <Upload ref={uploadElm} className="flex-1" onChange={handleChange}>
          <div
            className="flex items-center justify-center w-full h-80 border border-dashed border-slate-300 rounded cursor-pointer hover:border-slate-800"
            onClick={() => uploadElm.current?.click()}
          >
            +
          </div>
        </Upload>
        <ul className="w-40">
          {localImgData.map(({ type, base64 }) => (
            <li key={base64.slice(-6)}>
              <Image
                src={`data:${type};base64,${base64}`}
                width={20}
                height={20}
                alt="img"
              />
            </li>
          ))}
        </ul>
      </div>
    </Popover>
  )
})
