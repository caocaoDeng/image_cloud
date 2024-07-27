import Header from './header/header'
import Sider from './sider/sider'
import Content from './content/content'
import styles from './index.module.scss'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
    <main className={styles.layout}>
      <Header />
      <div className={styles.content}>
        <Sider></Sider>
        <Content>{ children }</Content>
      </div>
    </main>
    )
}