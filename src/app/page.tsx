'use client'

import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { InitialState, setAuthToken, setUserInfo } from '@/store/user'
import { fetchReposContent, fetchUserRepos } from '@/store/repository'
import { LOGFILENAME, USERINFO, BASE_PATH } from '@/utils/const'
import { ReposContent, Repository, User } from '@/api/interface'
import Layout from '@/components/Layout'
import WaterFall from '@/components/WaterFall'
import api from '@/api'

export interface ImageInfo {
  width: number
  height: number
  // 图片上传成功返回的唯一字段
  sha: string
  style?: {
    width: string
    height: string
    transform: string
  }
}

export type ExtendReposContent = ReposContent & ImageInfo

export default function Home() {
  const { user, repository } = useAppSelector((store) => store)
  const { content } = repository
  const dispatch = useAppDispatch()

  const [data, setData] = useState<ExtendReposContent[]>([])

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

  /**
   * 读取日志文件
   */
  let logData: ImageInfo[] | null = null
  const readLogFile = async () => {
    const logFile = content.find(({ name }) => name === LOGFILENAME)
    if (!logFile) return null
    const { login } = user.user as User
    const { name } = repository.repos as Repository
    const res = (await api.getReposContent({
      owner: login,
      repo: name,
      path: `${BASE_PATH}/${LOGFILENAME}`,
    })) as ReposContent
    // 解析base64
    const jsonStr = atob(res.content)
    logData = JSON.parse(jsonStr)
  }

  /**
   * 获取指定图片的信息
   * @param sha repos content 的唯一值
   */
  const getGivenImageInfo = (sha: string) => {
    if (!logData) return {}
    return logData.find(({ sha: imgSha }) => imgSha === sha) || {}
  }

  const updateData = async () => {
    await readLogFile()
    const imgList = content
      .filter(({ name, type }) => type === 'file' && name !== LOGFILENAME)
      .map((item) => {
        const { width = 200, height = 200 } = getGivenImageInfo(
          item.sha
        ) as ImageInfo
        return {
          ...item,
          width,
          height,
        }
      })
    setData(imgList)
  }

  useEffect(() => {
    updateData()
  }, [content])

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
