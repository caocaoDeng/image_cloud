import { forwardRef, useImperativeHandle, useRef } from 'react'

export interface IUploadEmitEvent {
  click(): void
}

export default forwardRef(function Upload(
  {
    className,
    children,
    ...rest
  }: { children: React.ReactNode; [key: string]: any },
  ref: React.ForwardedRef<IUploadEmitEvent>
) {
  const inputDom = useRef<HTMLInputElement>(null)

  useImperativeHandle(
    ref,
    () => ({
      click() {
        inputDom.current?.click()
      },
    }),
    []
  )

  return (
    <div className={`${className} flex items-center justify-center`}>
      {children}
      <input
        ref={inputDom}
        multiple
        className="hidden"
        type="file"
        accept="image/*"
        {...rest}
      />
    </div>
  )
})
