'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { InitialState, setAuthToken, setUserInfo } from '@/store/user'
import { fetchReposContent, fetchUserRepos } from '@/store/repository'
import { USERINFO } from '@/utils/const'
import Layout from '@/components/Layout'
import WaterFall, { Location } from '@/components/WaterFall'

export default function Home() {
  const dispatch = useAppDispatch()

  // 从本地初始化用户信息
  const initInfo = () => {
    const userInfo = localStorage.getItem(USERINFO)
    if (!userInfo) return
    const { auth_token, user } = JSON.parse(userInfo) as InitialState
    dispatch(setAuthToken(auth_token))
    user && dispatch(setUserInfo(user))
  }

  // 获取仓库数据
  const getUserRepos = async () => await dispatch(fetchUserRepos())
  // 获取仓库内容
  const getReposContent = async () => await dispatch(fetchReposContent())

  const getData = async () => {
    await getUserRepos()
    await getReposContent()
  }

  const data: Location[] = new Array(30).fill(0).map(() => ({
    height: Math.floor(Math.random() * 200 + 100),
  }))

  useEffect(() => {
    initInfo()
    getData()
  }, [])

  return (
    <Layout>
      <WaterFall maxWidth={196} gap={12} data={data}></WaterFall>
    </Layout>
  )
}
