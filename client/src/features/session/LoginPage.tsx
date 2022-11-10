import { useState, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createSession } from "../../lib/api";
import styles from './LoginPage.module.css';
import useSessionStore from "./sessionStore";


function mask(password: string) {
    return password.replace(/./g, '*')
}

export default function LoginPage() {
    const [loggingIn, setLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState("");

    const [host, setHost] = useState("localhost");
    const [port, setPort] = useState("5432");
    const [user, setUser] = useState("postgres");
    const [password, setPassword] = useState("");
    const [db, setDb] = useState("postgres");

    const [startSession] = useSessionStore(state => [state.open]);
    const navigate = useNavigate();
    const location = useLocation();

    const connect = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setLoggingIn(true);
            setLoginError("");
            const url = `postgres://${user}:${password}@${host}:${port}/${db}?sslmode=disable`;
            const response = await createSession(url);
            startSession(response.sessionId)

            const params = new URLSearchParams(location.search);
            const next = params.get('next') || '/pad';
            navigate(next);
        } catch (e: any) {
            console.log(e);
            setLoginError(e.message);
        } finally {
            setLoggingIn(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="py-6 px-10 w-1/2 rounded bg-white shadow-md">
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Connect to your database
                    </h2>
                    {loginError && (
                        <p className="mt-2 p-2 rounded text-md bg-red-300 text-red-800">
                            {loginError}
                        </p>)}
                </div>
                <form className="mt-8 space-y-6" onSubmit={connect}>
                    <div className={styles.grid}>
                        <label className="mr-2 mb-2" htmlFor="host">Host</label>
                        <div className="rounded-md shadow-sm flex flex-row mb-2">
                            <input id="host" type="text" required
                                value={host} onChange={event => setHost(event.target.value)}
                                className="mr-1 rounded block w-10/12 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" />
                            <label className="sr-only" htmlFor="port">Port</label>
                            <input id="port" type="number" min="1" max="65535" defaultValue="5432"
                                value={port} onChange={event => setPort(event.target.value)}
                                className="rounded block w-1/6 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" />
                        </div>
                        <label className="mr-2 mb-2" htmlFor="username">Username</label>
                        <div className="rounded-md shadow-sm mb-2">
                            <input id="username" type="text" required
                                value={user} onChange={event => setUser(event.target.value)}
                                className="rounded block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" />
                        </div>
                        <label className="mr-2 mb-2" htmlFor="password">Password</label>
                        <div className="rounded-md shadow-sm mb-2">
                            <input id="password" type="password" required
                                value={password} onChange={event => setPassword(event.target.value)}
                                className="rounded block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" />
                        </div>
                        <label className="mr-2 mb-2" htmlFor="url">Database</label>
                        <div className="rounded-md shadow-sm mb-2">
                            <input type="text" required
                                value={db} onChange={event => setDb(event.target.value)}
                                className="rounded block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 my-2">
                        Will connect to postgres://{user}:{mask(password)}@{host}:{port}/{db}?sslmode=disable
                    </p>
                    <div>
                        <button type="submit" disabled={loggingIn}
                            className="flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            Connect
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
