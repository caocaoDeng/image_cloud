'use client'

import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { fetchUserInfo } from '@/store/user'
import { fetchUserRepository } from '@/store/repository'
import Layout from '@/components/Layout'

export default function Home() {
  const user = useAppSelector((store) => store.user.user)
  const dispatch = useAppDispatch()

  const getUserInfo = async () => {
    !user && (await dispatch(fetchUserInfo()))
    dispatch(fetchUserRepository())
  }

  useEffect(() => {
    getUserInfo()
  }, [])
  return (
    <Layout></Layout>
  )
}
