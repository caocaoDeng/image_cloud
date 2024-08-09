import Image from 'next/image'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { fetchReposContent, setContent } from '@/store/repository'
import { setBase, setEntryPath, setTheme, setCollapsed } from '@/store/config'
import { ReposContent, User } from '@/api/interface'
import styles from './header.module.scss'

export default function Header() {
  const dispath = useAppDispatch()
  const userInfo = useAppSelector((store) => store.user.user) as User
  const { isMobile, entryPath } = useAppSelector((store) => store.config)

  // 返回上一级
  const handleBack = async () => {
    await dispath(
      setEntryPath({ actionType: 'replace', entryPath: entryPath.slice(0, -1) })
    )
  }

  const handleQueryPath = async (type: 'back' | 'appoint', index?: number) => {
    if (entryPath.length === 1) return
    const updateEntryPath =
      type === 'appoint'
        ? entryPath.slice(0, (index || 0) + 1)
        : entryPath.slice(0, -1)
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
      <h1 className={`${styles.title} ${isMobile ? styles.mobile : ''}`}>
        <i
          className={`iconfont icon-github mr-2 leading-none ${styles.icon}`}
        ></i>
        <span className={isMobile ? 'hidden' : ''}>Cloud Image</span>
      </h1>
      <div className={styles.nav}>
        <span
          className={`iconfont icon-zhedie ${styles.collapsed} ${styles.icon}`}
          onClick={() => dispath(setCollapsed())}
        ></span>
        {isMobile ? (
          <div className={styles['path-nav']}>
            <span
              className={styles['path-nav-item']}
              onClick={() => handleQueryPath('back')}
            >
              返回上一级
            </span>
          </div>
        ) : (
          <ul className={styles['path-nav']}>
            {entryPath.map((path, index) => (
              <li
                key={index}
                className={styles['path-nav-item']}
                onClick={() => handleQueryPath('appoint', index)}
              >
                {path}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.actions}>
        <i
          className={`iconfont icon-dark ${styles.icon} ${styles['theme-btn']}`}
          onClick={() => dispath(setTheme())}
        ></i>
        <div
          className={`iconfont ${userInfo ? '' : 'icon-user'} ${styles.user}`}
        >
          {userInfo ? (
            <Image
              className="absolute inset-0"
              src={userInfo.avatar_url}
              width={32}
              height={32}
              alt="avatar"
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </header>
  )
}
