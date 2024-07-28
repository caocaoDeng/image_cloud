import styles from './sider.module.scss'

export default function Sider() {
  return (
    <nav className={styles.nav}>
      <ul className="h-full px-2.5 overflow-auto el-scrollbar">
        {new Array(40).fill(0).map((_, index) => {
            return (
                <li key={index} className={styles['dir-item']}>
                    <span className="iconfont icon-24gf-folder"></span>
                    <span className="flex-1 truncate">文件夹名称{index}</span>
                </li>
            )
        })}
      </ul>
    </nav>
  )
}