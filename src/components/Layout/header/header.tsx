import styles from './header.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <i className="iconfont"></i>
        <span>Cloud Image</span>
      </h1>
      <nav className={styles.nav}></nav>
      <div className={styles.actions}>
        <i className="iconfont icon-dark"></i>
        <i className="iconfont icon-user"></i>
      </div>
    </header>
  )
}
