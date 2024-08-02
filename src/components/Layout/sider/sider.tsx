import { useEffect, useRef, useState } from 'react'
import store from '@/store'
import { useAppDispatch } from '@/store/hooks'
import { fetchUserRepository } from '@/store/repository'
import { ReposContent } from '@/api/interface'
import { BASE_PATH } from '@/utils/const'
import CreateDir, { CreateDirPopEmitEvent } from './create-dir'
import UploadImgPop, { UploadImgPopEmitEvent } from './upload-img-pop'
import styles from './sider.module.scss'

export default function Sider() {
  const dispatch = useAppDispatch()

  const imgPopElm = useRef<UploadImgPopEmitEvent>(null)
  const dirPopElm = useRef<CreateDirPopEmitEvent>(null)

  const [dir, setDir] = useState<ReposContent[]>([])

  const getUserRepos = async () => {
    await dispatch(fetchUserRepository())
    const { repository: repo } = store.getState()
    const dirData = repo.content.filter(({ type }) => type === 'dir')
    setDir(dirData)
  }

  useEffect(() => {
    getUserRepos()
  }, [])

  return (
    <nav className={styles.nav}>
      <div className="px-2.5 pt-5 pb-2.5">
        <input
          defaultValue={BASE_PATH}
          type="text"
          disabled
          className="border-0"
          style={{
            background: 'rgb(var(--placeholder))',
            color: 'rgb(var(--foreground))',
          }}
        />
      </div>
      <ul className="flex-1 px-2.5 overflow-auto el-scrollbar">
        {dir.map(({ name, sha }) => (
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
            style={{
              background: 'rgb(var(--placeholder))',
              color: 'rgb(var(--foreground))',
            }}
          />
        </div>
        <div className="flex gap-2">
          <button
            className={styles.btn}
            onClick={() => dirPopElm.current?.setVisible(true)}
          >
            新建目录
          </button>
          <button
            className={styles.btn}
            onClick={() => imgPopElm.current?.setVisible(true)}
          >
            上传
          </button>
        </div>
      </div>
      <CreateDir ref={dirPopElm} />
      <UploadImgPop ref={imgPopElm} />
    </nav>
  )
}
