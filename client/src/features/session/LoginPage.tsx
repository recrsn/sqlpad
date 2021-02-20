import React, {useState} from "react";
import {useHistory, useLocation} from "react-router";
import {createSession} from "../../lib/api";
import {useSession} from "./sessionHooks";


export default function LoginPage() {
    const [loggingIn, setLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState("");

    const [url, setUrl] = useState("");
    const {startSession} = useSession();
    const history = useHistory();
    const location = useLocation();

    const connect = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setLoggingIn(true);
            setLoginError("");
            const response = await createSession(url);
            startSession(response.sessionId)

            const params = new URLSearchParams(location.search);
            const next = params.get('next') || '/';
            history.replace({pathname: next});
        } catch (e) {
            console.log(e);
            setLoginError(e.message);
        } finally {
            setLoggingIn(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="py-6 px-10 w-6/12 rounded bg-white shadow-md">
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Connect to your database
                    </h2>
                    {loginError && (
                        <p className="mt-2 p-2 rounded text-md bg-red-300 text-red-800">
                            {loginError}
                        </p>)}
                    <p className="mt-2 text-sm text-gray-600">
                        Provide a full URI to your database
                    </p>
                </div>
                <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={connect}>
                    <div className="rounded-md shadow-sm">
                        <div>
                            <label htmlFor="url" className="sr-only">Database URI</label>
                            <input id="url" name="url" type="url" required
                                   value={url} onChange={event => setUrl(event.target.value)}
                                   className="rounded block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                   placeholder="postgres://postgres:password@127.0.0.1/postgres?sslmode=disable"/>
                        </div>
                    </div>

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
