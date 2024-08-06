/* eslint-disable jsx-a11y/alt-text */
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export const enum loadText {
  LOADING = '加载中...',
  ERROR = '加载失败',
}

export default function ImageLazy({
  target,
  lazy = false,
  className,
  src,
  style = { textColor: 'rgb(0, 0, 0)', bgColor: 'rgb(255, 255, 255)' },
  ...rest
}: {
  target?: Window | HTMLElement | null
  lazy?: boolean
  style?: {
    textColor: string
    bgColor: string
  }
  className: string
  width: number
  height: number
  src: string
  alt: string
}) {
  const elm = useRef<HTMLDivElement>(null)
  const [loadSrc, setLodSrc] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [text, setText] = useState<string>(loadText.LOADING)

  /**
   * 判断是否在窗口内
   * @param scrollTop 滚动条的位置
   * @returns boolean
   */
  const computedLocation = (scrollTop: number) => {
    const windowHeight = screen.height
    const { top } = elm.current?.getBoundingClientRect() as DOMRect
    return top - scrollTop < windowHeight
  }

  /**
   * 加载图片
   * @returns Promise<boolean>
   */
  const loadImage = () => {
    return new Promise<boolean>((res, rej) => {
      const image = new window.Image()
      image.src = src
      image.onload = () => res(true)
      image.onerror = () => rej(false)
      image.onabort = () => rej(false)
    })
      .catch(() => {
        setText(loadText.ERROR)
      })
      .finally(() => {
        setLodSrc(src)
        setLoading(false)
        target?.removeEventListener('scroll', initLoad)
      })
  }

  /**
   * 加载逻辑
   * @param e Scroll Event
   * @returns Promise
   */
  const initLoad = async (e?: Event) => {
    if (!lazy) return await loadImage()
    // 首次加载 scrollTop 为0
    const { scrollTop = 0 } = e ? (e.target as HTMLElement) : {}
    const isInWindow = computedLocation(scrollTop)
    isInWindow && (await loadImage())
  }

  // 注册监听事件
  const installListenerEnvent = () => {
    if (!lazy) return
    window.removeEventListener('scroll', initLoad)
    target?.addEventListener('scroll', initLoad)
  }

  useEffect(() => {
    initLoad()
  }, [])

  useEffect(() => {
    installListenerEnvent()
  }, [target])

  return (
    <div ref={elm} className={`relative inline-block ${className}`}>
      {loading || text === loadText.ERROR ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-sm"
          style={{ color: style.textColor, backgroundColor: style.bgColor }}
        >
          <p
            className={`iconfont icon-loading1 animate-spin ${
              text === loadText.ERROR ? 'hidden' : ''
            }`}
          ></p>
          <p>{text}</p>
        </div>
      ) : (
        <Image
          className="w-full h-full"
          {...rest}
          src={loadSrc}
          loader={(img) => img.src}
        ></Image>
      )}
    </div>
  )
}
