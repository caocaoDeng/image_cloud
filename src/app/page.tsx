'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { InitialState, setAuthToken, setUserInfo } from '@/store/user'
import { fetchUserRepos } from '@/store/repository'
import { USERINFO } from '@/utils/const'
import Layout from '@/components/Layout'
import WaterFall, { Location } from '@/components/WaterFall'

export default function Home() {
  const dispatch = useAppDispatch()
  // 从本地初始化用户信息
  const userInfo = localStorage.getItem(USERINFO)
  const { auth_token, user } = JSON.parse(userInfo || '{}') as InitialState
  dispatch(setAuthToken(auth_token))
  user && dispatch(setUserInfo(user))

  // 获取仓库数据
  const getUserRepos = async () => await dispatch(fetchUserRepos())
  getUserRepos()

  const data: Location[] = new Array(30).fill(0).map(() => ({
    height: Math.floor(Math.random() * 200 + 100),
  }))

  return (
    <Layout>
      <WaterFall maxWidth={196} gap={12} data={data}></WaterFall>
    </Layout>
  )
}
