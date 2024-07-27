import styles from './content.module.scss'

export default function Content({ children }: { children: React.ReactNode }) {
    return <div className={styles.content}>{children}</div>
}