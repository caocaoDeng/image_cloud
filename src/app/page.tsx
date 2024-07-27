'use client'

import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { fetchUserInfo } from '@/store/user'
import { fetchUserRepository } from '@/store/repository'
import Layout from '@/components/Layout'
import WaterFall, { Location } from '@/components/WaterFall'

export default function Home() {
  const user = useAppSelector((store) => store.user.user)
  const dispatch = useAppDispatch()

  const getUserInfo = async () => {
    !user && (await dispatch(fetchUserInfo()))
    dispatch(fetchUserRepository())
  }

  const data: Location[] = new Array(30)
    .fill(0)
    .map(() => ({
        height: Math.floor(Math.random() * 200 + 100)
    }))

  useEffect(() => {
    getUserInfo()
  }, [])
  return (
    <Layout>
      <WaterFall maxWidth={196} gap={12} data={data}></WaterFall>
    </Layout>
  )
}
