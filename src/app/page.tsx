'use client'

import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { InitialState, setAuthToken, setUserInfo } from '@/store/user'
import {
  createRepos,
  createReposContent,
  fetchReposContent,
  fetchUserRepos,
  setContent,
  setRepos,
} from '@/store/repository'
import { ImageInfo, LogsData, getGivenImageInfo } from '@/utils'
import { LOGFILENAME, USERINFO, LOGKEY } from '@/utils/const'
import { ReposContent } from '@/api/interface'
import Layout from '@/components/Layout'
import WaterFall from '@/components/WaterFall'

export type ExtendReposContent = ReposContent & ImageInfo

export default function Home() {
  const dispatch = useAppDispatch()
  const { content } = useAppSelector(store => store.repository)
  const theme = useAppSelector(store => store.config.theme)

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
  const getUserRepos = async () => {
    let repos = await dispatch(fetchUserRepos())
    if (repos) return await dispatch(setRepos(repos))
    repos = await dispatch(createRepos())
    await dispatch(setRepos(repos))
  }

  // 获取仓库内容
  const getReposContent = async () => {
    try {
      const reposContent = (await dispatch(
        fetchReposContent()
      )) as ReposContent[]
      await dispatch(setContent({ content: reposContent }))
    } catch (error: any) {
      // 未查询到路径进行初始化
      const { status } = error
      if (status === 404) {
        const r = await dispatch(
          createReposContent({
            path: LOGFILENAME,
            content: '',
          })
        )
        await dispatch(setContent({ content: [r] }))
      }
    }
  }

  // 读取日志文件，存储到本地
  const readLogsFile = async () => {
    const logFile = content.find(({ name }) => name === LOGFILENAME)
    if (!logFile) return
    const logs = (await dispatch(
      fetchReposContent(LOGFILENAME)
    )) as ReposContent
    // 解析base64
    const logsJson: LogsData = {
      sha: logs.sha,
      content: JSON.parse(atob(logs.content) || '[]'),
    }
    localStorage.setItem(LOGKEY, JSON.stringify(logsJson))
  }

  const getData = async () => {
    await getUserRepos()
    await getReposContent()
  }

  const updateData = async () => {
    await readLogsFile()
    const imgList = content
      .filter(({ name, type }) => type === 'file' && name !== LOGFILENAME)
      .map(item => {
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
    <div className={theme === 'light' ? 'light' : ''}>
      <Layout>
        <WaterFall maxWidth={196} gap={12} data={data}></WaterFall>
      </Layout>
    </div>
  )
}
