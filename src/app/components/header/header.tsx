import styles from './header.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className="logo">logo</div>
      <nav className="nav"></nav>
      <div className="actions"></div>
    </header>
  )
}
