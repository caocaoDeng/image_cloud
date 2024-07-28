'use client'

import Layout from '@/components/Layout'
import WaterFall, { Location } from '@/components/WaterFall'

export default function Home() {

  const data: Location[] = new Array(30)
    .fill(0)
    .map(() => ({
        height: Math.floor(Math.random() * 200 + 100)
    }))

  return (
    <Layout>
      <WaterFall maxWidth={196} gap={12} data={data}></WaterFall>
    </Layout>
  )
}
