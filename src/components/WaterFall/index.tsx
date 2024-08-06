'use client'
import { useEffect, useRef, useState } from 'react'
import { ExtendReposContent } from '@/app/page'
import { download } from '@/utils/index'
import ImageLazy from '../ImageLazy'
import styles from './waterfall.module.scss'

const actionsList = [
  {
    action: 'copy',
    icon: 'icon-fuzhi',
  },
  {
    action: 'download',
    icon: 'icon-xiazai',
  },
]

export interface Action {
  type: string
  payload: {
    name: string
    url: string
  }
}

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

  const handleActions = async ({ type, payload }: Action) => {
    if (type === 'copy') {
      return await navigator.clipboard.writeText(payload.url)
    }
    return download(payload.url, payload.name)
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
      {value.map(({ name, width, height, download_url, sha, style }, index) => {
        return (
          <div
            key={sha + index}
            className={styles['water-fall-item']}
            style={{ ...style }}
          >
            <ImageLazy
              className="w-full h-full transition-all hover:scale-110"
              target={wfContainerElm.current?.parentElement}
              lazy={true}
              style={{
                textColor: 'rgb(var(--foreground))',
                bgColor: 'rgb(var(--background))',
              }}
              src={download_url}
              width={width}
              height={height}
              alt={name}
            />
            <div className={styles.actions}>
              {actionsList.map(({ action, icon }) => (
                <span
                  key={action}
                  className={`iconfont ${icon} ${styles['action-item']}`}
                  onClick={() =>
                    handleActions({
                      type: action,
                      payload: { name, url: download_url },
                    })
                  }
                ></span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
