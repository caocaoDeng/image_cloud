import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function ImageLazy({
  lazy = false,
  src,
  ...rest
}: {
  lazy: boolean
  width: number
  height: number
  src: string
  alt: string
}) {
  const imgElm = useRef<HTMLImageElement>(null)

  const computedLocation = () => {
    const windowHeight = screen.height
    const elmTop = imgElm.current?.offsetTop
    const scrollTop = window.scrollY
  }

  useEffect(() => {
    window.addEventListener('scroll', (e: any) => {
      console.log(e)
    })
  }, [])
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image ref={imgElm} {...rest} src={''}></Image>
}
