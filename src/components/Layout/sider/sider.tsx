import { useEffect, useRef, useState } from 'react'
import { fetchReposContent, setContent } from '@/store/repository'
import { setBase, setEntryPath } from '@/store/config'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { ReposContent } from '@/api/interface'
import CreateDir, { CreateDirPopEmitEvent } from './create-dir'
import UploadImgPop, { UploadImgPopEmitEvent } from './upload-img-pop'
import styles from './sider.module.scss'

export default function Sider() {
  const dispath = useAppDispatch()
  const { isMobile, isCollapsed, base } = useAppSelector(
    (store) => store.config
  )
  const { content } = useAppSelector((store) => store.repository)

  const imgPopElm = useRef<UploadImgPopEmitEvent>(null)
  const dirPopElm = useRef<CreateDirPopEmitEvent>(null)

  const [dir, setDir] = useState<ReposContent[]>([])
  const [activeDir, setActiveDir] = useState<string>('')
  const [icon, setIcon] = useState<string>('icon-shanchu')
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * 查询某路径下的内容
   * @param name path name
   */
  const handleQueryPath = async (name: string) => {
    if (loading) return
    setIcon('icon-loading1')
    setActiveDir(name)
    setLoading(true)
    // 获取content
    const reposContent = (await dispath(
      fetchReposContent(name)
    )) as ReposContent[]
    dispath(setContent({ actionType: 'replace', content: reposContent }))
    dispath(setBase(name))
    dispath(setEntryPath({ entryPath: `/${name}` }))
    // 进入后取消激活样式
    setIcon('icon-shanchu')
    setActiveDir('')
    setLoading(false)
  }

  useEffect(() => {
    const dirData = content.filter(({ type }) => type === 'dir')
    setDir(dirData)
  }, [content])

  return (
    <nav
      className={`${styles.nav} ${isMobile ? styles.mobile : ''} ${
        isCollapsed ? styles['collapsed-true'] : styles['collapsed-false']
      }`}
    >
      <div className="px-2.5 pt-5 pb-2.5">
        <input
          defaultValue={base}
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
        {dir.map(({ name }, index) => (
          <li
            key={name + index}
            className={`${styles['dir-item']} ${
              !loading ? styles.hovered : ''
            } ${activeDir === name ? styles.active : ''}`}
            onClick={() => handleQueryPath(name)}
          >
            <span className="iconfont icon-24gf-folder"></span>
            <span className="flex-1 truncate">{name}</span>
            <span
              className={`hidden iconfont ${icon} ${styles['action-icon']} ${
                loading ? 'animate-spin' : ''
              }`}
            ></span>
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
