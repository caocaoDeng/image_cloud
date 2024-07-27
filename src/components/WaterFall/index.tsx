import { useEffect, useRef, useState } from 'react'

export interface Location {
    height?: number,
    style?: {
        width: string,
        height: string,
        transform: string
    }
}

export default function WaterFall({ maxWidth, gap, data }:{ maxWidth: number, gap: number, data: Location[]}) {
    const wfContainerElm = useRef<HTMLDivElement>(null)
    const [value, setValue] = useState<Location[]>([])

    /**
     * 获取基本信息
     * width 每一项的宽度，len 需要展示的列数
     * @returns {width, leng}
     */
    const getInfo = (): { width: number, len: number} => {
        let { width = 0 } = wfContainerElm.current?.getBoundingClientRect() || {}
        const count = Math.round(width / maxWidth)
        width = (width - (count - 1) * gap) / count
        return {
            width: count === 1 && width < maxWidth ? maxWidth : width,
            len: count
        }
    }

    const getPosition = (): Location[] => {
        const { width, len } = getInfo()
        const col: number[] = new Array(len).fill(0)

        return data.map(({height}, index) => {
            const minIndex = col.indexOf(Math.min(...col))
            const offsetX = (width + gap) * minIndex
            const offsetY = index < len ? 0 : col[minIndex]
            col[minIndex] += (height || 0) + gap
            return {
                style: {
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: `translate(${offsetX}px, ${offsetY}px)` 
                }
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
    }, [])

    return(
        <div className="relative w-full" ref={wfContainerElm}>
            {value.map((item, index) => {
                return <div key={index} className="absolute border rounded transition-all" style={{borderColor: 'rgb(var(--border-style))', ...item.style}}></div>
            })}
        </div>
    )
}