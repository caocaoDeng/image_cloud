/* eslint-disable @next/next/no-img-element */
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const actionMap = {
  grow: 'icon-23fangda',
  shrink: 'icon-24suoxiao',
  rotateL: 'icon-a-xuanzhuanmianban-rotatepanel-anti',
  rotateR: 'icon-a-xuanzhuanmianban-rotatepanel',
  close: 'icon-close',
}

export default function ImagePreview({
  visible,
  startIndex,
  data,
  onClose,
}: {
  visible: boolean
  startIndex: number
  data: string[]
  onClose: Dispatch<SetStateAction<boolean>>
}) {
  const [index, setIndex] = useState<number>(startIndex)
  const [curSrc, setCurSrc] = useState<string>('')

  const dispatchAction = (type: string) => {
    switch (type) {
      case 'close': {
        return onClose(false)
      }

      default:
        break
    }
  }

  const handleAction = (type: 'add' | 'sub') => {
    if (index <= 0 && index > data.length) return
    setIndex((index) => index + (type === 'add' ? 1 : -1))
  }

  useEffect(() => {
    setIndex(startIndex)
  }, [startIndex])

  useEffect(() => {
    setCurSrc(data[index])
  }, [index, data])

  return visible ? (
    <div className="fixed inset-0 bg-black">
      <img
        className="w-full h-full object-scale-down"
        src={curSrc}
        alt="iamge preview"
      />
      <div className="absolute top-0 flex items-center justify-end gap-4 w-full h-12 px-8 leading-none text-neutral-300">
        {Object.entries(actionMap).map(([k, icon]) => (
          <span
            key={k}
            className={`iconfont ${icon} icon-23fangda cursor-pointer hover:text-white`}
            style={{ fontSize: 22 }}
            onClick={() => dispatchAction(k)}
          ></span>
        ))}
      </div>
      <span
        className="iconfont icon-xiangyou-copy absolute top-1/2 left-8 cursor-pointer text-neutral-300 hover:text-white"
        style={{ fontSize: 28 }}
        onClick={() => handleAction('sub')}
      ></span>
      <span
        className="iconfont icon-xiangyou absolute top-1/2 right-8 cursor-pointer text-neutral-300 hover:text-white"
        style={{ fontSize: 28 }}
        onClick={() => handleAction('add')}
      ></span>
    </div>
  ) : (
    <></>
  )
}
