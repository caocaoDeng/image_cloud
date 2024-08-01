'use client'

import { useAppDispatch } from '@/store/hooks'
import { InitialState, setAuthToken, setUserInfo } from '@/store/user'
import { USERINFO } from '@/utils/const'
import Layout from '@/components/Layout'
import WaterFall, { Location } from '@/components/WaterFall'

export default function Home() {
  const dispath = useAppDispatch()
  // 从本地初始化用户信息
  const userInfo = localStorage.getItem(USERINFO)
  const { auth_token, user } = JSON.parse(userInfo || '{}') as InitialState
  dispath(setAuthToken(auth_token))
  user && dispath(setUserInfo(user))

  const data: Location[] = new Array(30).fill(0).map(() => ({
    height: Math.floor(Math.random() * 200 + 100),
  }))

  return (
    <Layout>
      <WaterFall maxWidth={196} gap={12} data={data}></WaterFall>
    </Layout>
  )
}
