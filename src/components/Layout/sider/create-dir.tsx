import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useImperativeHandle,
  useState,
} from 'react'
import { createReposContent, setContent } from '@/store/repository'
import { useAppDispatch } from '@/store/hooks'
import Popover from '@/components/Popover'

export interface CreateDirPopEmitEvent {
  setVisible: Dispatch<SetStateAction<boolean>>
}

export default forwardRef(function UploadImgPop(
  props,
  ref: React.ForwardedRef<CreateDirPopEmitEvent>
) {
  const dispath = useAppDispatch()

  const [visible, setVisible] = useState<boolean>(false)
  const [valid, setValid] = useState<boolean>(false)
  const [dirName, setDirName] = useState<string>('')

  const handleChange = (e: React.BaseSyntheticEvent) => {
    const value = e.target.value
    setValid(!value)
    setDirName(value)
  }

  const handleClose = () => {
    setDirName('')
    setVisible(false)
  }

  const handleSubmit = async () => {
    if (!dirName) return setValid(true)
    const content = await dispath(
      createReposContent({ path: `${dirName}/log.txt`, content: '' })
    )
    await dispath(
      setContent([
        {
          ...content,
          name: dirName,
          type: 'dir',
        },
      ])
    )
    handleClose()
  }

  useImperativeHandle(
    ref,
    () => ({
      setVisible,
    }),
    []
  )

  return (
    <Popover
      title="创建目录"
      visible={visible}
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <form>
        <label className="form-item">
          <span className="label">目录名称</span>
          <input
            type="text"
            className="mt-1"
            placeholder="避免输入空格"
            required={valid}
            value={dirName}
            onChange={handleChange}
          />
          {valid ? <p className="error">请填写目录名称</p> : <></>}
        </label>
      </form>
    </Popover>
  )
})
