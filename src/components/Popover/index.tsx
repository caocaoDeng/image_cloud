import { useEffect, useRef, Dispatch, SetStateAction, useState } from 'react'

export default function Popover({
  title,
  visible,
  onClose,
  onSubmit,
  children,
  ...rest
}: {
  visible?: boolean
  title?: string
  onClose?: Dispatch<SetStateAction<boolean>>
  onSubmit?: () => void
  children?: React.ReactNode
}) {
  const popoverElm = useRef<HTMLDivElement>(null)

  const [status, setStatus] = useState<boolean>(false)

  const submit = async () => {
    onSubmit ? await onSubmit() : setStatus(false)
  }

  useEffect(() => {
    setStatus(!!visible)
  }, [visible])

  useEffect(() => {
    popoverElm.current?.togglePopover()
    !status && onClose && onClose(false)
  }, [onClose, status])

  return (
    <div
      className="fixed top-0 left-0 w-full h-full"
      style={{
        display: status ? 'block' : 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }}
    >
      <div
        {...rest}
        ref={popoverElm}
        popover="manual"
        className="rounded-lg"
        style={{ width: '520px' }}
      >
        <header className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-300">
          <h3 className="flex-1 font-medium truncate">{title}</h3>
          <span
            className="iconfont icon-close leading-none cursor-pointer text-zinc-400 hover:text-zinc-500"
            style={{ fontSize: '18px' }}
            onClick={() => setStatus(false)}
          ></span>
        </header>
        <main className="p-4 text-sm">{children}</main>
        <footer className="flex items-center justify-end gap-4 px-4 py-3 border-t border-zinc-300">
          <button
            className="text-zinc-500 bg-transparent hover:text-blue-500 hover:bg-transparent"
            onClick={() => setStatus(false)}
          >
            取消
          </button>
          <button onClick={submit}>确定</button>
        </footer>
      </div>
    </div>
  )
}
