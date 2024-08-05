import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ExtendReposContent } from '@/app/page'
import styles from './waterfall.module.scss'

export default function WaterFall({
  maxWidth,
  gap,
  data,
}: {
  maxWidth: number
  gap: number
  data: ExtendReposContent[]
}) {
  const wfContainerElm = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState<ExtendReposContent[]>([])
  const [actions, setActions] = useState<string[]>([
    'icon-fuzhi',
    'icon-xiazai',
  ])

  /**
   * 获取基本信息
   * width 每一项的宽度，len 需要展示的列数
   * @returns {width, leng}
   */
  const getInfo = (): { width: number; len: number } => {
    let { width = 0 } = wfContainerElm.current?.getBoundingClientRect() || {}
    const count = Math.round(width / maxWidth)
    width = (width - (count - 1) * gap) / count
    return {
      width: count === 1 && width < maxWidth ? maxWidth : width,
      len: count,
    }
  }

  const getPosition = (): ExtendReposContent[] => {
    const { width: containerWidth, len } = getInfo()
    const col: number[] = new Array(len).fill(0)

    return data.map((item, index) => {
      const { width, height } = item
      const minIndex = col.indexOf(Math.min(...col))
      const offsetX = (containerWidth + gap) * minIndex
      const offsetY = index < len ? 0 : col[minIndex]
      const containerHeight = (containerWidth * height) / width
      col[minIndex] += containerHeight + gap
      return {
        ...item,
        style: {
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          transform: `translate(${offsetX}px, ${offsetY}px)`,
        },
      }
    })
  }

  const updateData = () => {
    const imgData = getPosition()
    setValue(imgData)
  }

  useEffect(() => {
    updateData()
    window.addEventListener('resize', updateData)
    return () => {
      window.removeEventListener('resize', updateData)
    }
  }, [data])

  return (
    <div className="relative w-full" ref={wfContainerElm}>
      {value.map(({ width, height, download_url, sha, style }, index) => {
        return (
          <div
            key={sha + index}
            className="absolute border rounded transition-all cursor-pointer"
            style={{ borderColor: 'rgb(var(--border-style))', ...style }}
          >
            <Image
              className="w-full h-full"
              loader={(img) => img.src}
              width={width}
              height={height}
              src={download_url}
              alt="img"
            />
            <div className="flex gap-2 absolute top-2 right-2">
              {actions.map((item) => (
                <span
                  key={item}
                  className={`iconfont ${item} flex items-center justify-center w-6 h-6 rounded leading-none ${styles['action-item']}`}
                ></span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
