import styles from './page.module.scss'

export default function Login() {
    return <div className={`${styles.login} fixed flex items-center justify-center w-screen h-screen`}>
        <div className="fixed top-20 left-0 p-2 pr-4 rounded-r-full leading-none bg-white">Image</div>
        <div className="w-72 min-h-max p-3 rounded bg-white">
            <form>
                <label className="form-item">
                    <span>Auth Token</span>
                    <input type="text" value="tbone" />
                </label>
                <button type="button" className={`${styles.button} w-full text-white`}>连接</button>
            </form>
        </div>
    </div>
}