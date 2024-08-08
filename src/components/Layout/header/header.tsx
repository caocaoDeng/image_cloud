import Image from 'next/image'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { fetchReposContent, setContent } from '@/store/repository'
import { setBase, setEntryPath, setTheme, setCollapsed } from '@/store/config'
import { ReposContent, User } from '@/api/interface'
import styles from './header.module.scss'

export default function Header() {
  const dispath = useAppDispatch()
  const userInfo = useAppSelector((store) => store.user.user) as User
  const entryPath = useAppSelector((store) => store.config.entryPath)

  const handleQueryPath = async (index: number) => {
    const updateEntryPath = entryPath.slice(0, index + 1)
    await dispath(
      setEntryPath({ actionType: 'replace', entryPath: updateEntryPath })
    )
    // 获取content
    const reposContent = (await dispath(fetchReposContent())) as ReposContent[]
    dispath(setContent({ actionType: 'replace', content: reposContent }))
    dispath(setBase(updateEntryPath[updateEntryPath.length - 1]))
  }

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <i className="iconfont"></i>
        <span>Cloud Image</span>
      </h1>
      <div className={styles.nav}>
        <span
          className={`iconfont icon-zhedie ${styles.collapsed}`}
          onClick={() => dispath(setCollapsed())}
        ></span>
        <ul className={styles['path-nav']}>
          {entryPath.map((path, index) => (
            <li
              key={index}
              className={styles['path-nav-item']}
              onClick={() => handleQueryPath(index)}
            >
              {path}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.actions}>
        <i
          className="iconfont icon-dark"
          onClick={() => dispath(setTheme())}
        ></i>
        <Image
          className={styles.avatar}
          src={userInfo?.avatar_url}
          width={30}
          height={30}
          alt="avatar"
        />
      </div>
    </header>
  )
}
