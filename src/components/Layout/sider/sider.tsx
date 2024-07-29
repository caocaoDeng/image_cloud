import { useEffect, useState } from 'react'
import store from '@/store'
import { useAppDispatch } from '@/store/hooks'
import { fetchUserRepository } from '@/store/repository'
import { ReposContent } from '@/api/interface'
import { BASE_PATH } from '@/utils/const'
import styles from './sider.module.scss'

export default function Sider() {
  const dispatch = useAppDispatch()

  const [dir, setDir] = useState<ReposContent[]>(new Array(33).fill(0).map((_, index) => ({
    name: '新建文件夹' + index,
    sha: index
  })))
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
      <div className="px-2.5 pt-5 pb-2.5">
        <input
          defaultValue={BASE_PATH}
          type="text" disabled
          className="border-0"
          style={{background: 'rgb(var(--placeholder))', color: 'rgb(var(--foreground))'}} />
      </div>
      <ul className="flex-1 px-2.5 overflow-auto el-scrollbar">
        {dir.map(({name, sha}) => (
          <li key={sha} className={styles['dir-item']}>
            <span className="iconfont icon-24gf-folder"></span>
            <span className="flex-1 truncate">{name}</span>
          </li>
        ))}
      </ul>
      <div className="flex gap-3 p-2.5">
        <div className={styles.search}>
          <input
            type="text"
            placeholder="搜索分类"
            className="px-2.5 py-1.5 rounded-full border-0 indent-2 focus:border-0 focus:ring-0 placeholder:text-xs"
            style={{background: 'rgb(var(--placeholder))', color: 'rgb(var(--foreground))'}} />
        </div>
        <div className="flex gap-2">
          <button className={styles.btn}>新建目录</button>
          <button className={styles.btn}>上传</button>
        </div>
      </div>
    </nav>
  )
}