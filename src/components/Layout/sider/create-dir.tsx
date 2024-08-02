import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import Popover from '@/components/Popover'

export interface CreateDirPopEmitEvent {
  setVisible: Dispatch<SetStateAction<boolean>>
}

export default forwardRef(function UploadImgPop(
  props,
  ref: React.ForwardedRef<CreateDirPopEmitEvent>
) {
  const [visible, setVisible] = useState<boolean>(false)
  const [valid, setValid] = useState<boolean>(false)
  const [dirName, setDirName] = useState<string>('')

  const handleChange = (e: React.BaseSyntheticEvent) => {
    const value = e.target.value
    setValid(!value)
    setDirName(value)
  }

  useImperativeHandle(
    ref,
    () => ({
      setVisible,
    }),
    []
  )

  return (
    <Popover title="创建目录" visible={visible} onClose={setVisible}>
      <form>
        <label className="form-item">
          <span className="label">目录名称</span>
          <input
            type="text"
            className="mt-1"
            required={valid}
            defaultValue={dirName}
            onChange={handleChange}
          />
          {valid ? <p className="error">请填写目录名称</p> : <></>}
        </label>
      </form>
    </Popover>
  )
})
