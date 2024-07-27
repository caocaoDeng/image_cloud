import Header from './header/header'
import Sider from './sider/sider'
import Content from './content/content'
import styles from './index.module.scss'

export default function Layout() {
    return (
    <main className={styles.layout}>
      <Header />
      <div className={styles.content}>
        <Sider></Sider>
        <Content></Content>
      </div>
    </main>
    )
}