import { useEffect, useRef, Dispatch, SetStateAction } from 'react'

export default function Popover({
  visible = false,
  onClose,
  children,
}: {
  visible?: boolean
  onClose?: Dispatch<SetStateAction<boolean>>
  children?: React.ReactNode
}) {
  const popoverElm = useRef<HTMLDivElement>(null)

  const closePopover = () => {
    popoverElm.current?.togglePopover()
    onClose && onClose(false)
  }

  useEffect(() => {
    popoverElm.current?.togglePopover()
  }, [visible])

  return (
    <div
      className="fixed top-0 left-0 w-full h-full"
      style={{
        display: visible ? 'block' : 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }}
    >
      <div
        ref={popoverElm}
        popover="manual"
        className="p-5 rounded-lg"
        style={{ width: '520px' }}
      >
        {children}
      </div>
    </div>
  )
}
