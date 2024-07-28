import { useEffect, useState } from 'react'
import store from '@/store'
import { useAppDispatch } from '@/store/hooks'
import { fetchUserRepository } from '@/store/repository'
import { ReposContent } from '@/api/interface'
import styles from './sider.module.scss'

export default function Sider() {
  const dispatch = useAppDispatch()

  const [dir, setDir] = useState<ReposContent[]>([])
  const [imgData, setImgData] = useState<ReposContent[]>([])

  const getUserRepos = async () => {
    await dispatch(fetchUserRepository())
    const { repository: repo } = store.getState()
    const dirData = repo.content.filter(({type}) => type === 'dir')
    const fileData = repo.content.filter(({type}) => type === 'file')
    setDir(dirData)
    setImgData(fileData)
  }

  useEffect(() => {
    getUserRepos()
  }, [])
  
  return (
    <nav className={styles.nav}>
      <ul className="h-full px-2.5 overflow-auto el-scrollbar">
        {dir.map(({name, sha}) => (
          <li key={sha} className={styles['dir-item']}>
            <span className="iconfont icon-24gf-folder"></span>
            <span className="flex-1 truncate">{name}</span>
          </li>
        ))}
      </ul>
    </nav>
  )
}