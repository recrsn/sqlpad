import "codemirror/mode/sql/sql";
import React, {useState} from "react";
import {Controlled as CodeMirror} from 'react-codemirror2'
import {Result} from "../../lib/api";
import {useSession} from "../session/sessionHooks";
import styles from './PadPage.module.css';

type Maybe<T> = T | undefined;

function Cell() {
    const {execute} = useSession();
    const [result, setResult] = useState<Maybe<Result>>(undefined)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<Maybe<string>>(undefined)

    const [code, setCode] = useState("");

    const executeCode = async (sql: string) => {
        setBusy(true);
        setError("");
        setResult(undefined)
        try {
            setResult(await execute(sql))
        } catch (e) {
            console.log(e)
            setError(e.message);
        } finally {
            setBusy(false);
        }
    }

    const options = {
        mode: 'text/x-pgsql',
        lineNumbers: true,
        extraKeys: {
            'Shift-Enter': async () => {
                await executeCode(code);
            },
            'Ctrl-Enter': () => {
                console.log('This is called')
            },
            'Cmd-Enter': () => {
                console.log('This is called... sometimes')
            },
        },
    }
    return (
        <div>
            <div className="border-solid border-gray-100">
                {busy && (
                    <div>Executing...</div>
                )}
                <CodeMirror
                    value={code}
                    options={options}
                    onBeforeChange={(editor, data, value) => {
                        setCode(value);
                    }}
                />
            </div>
            {/*<textarea className="rounded w-full resize-none resize-y" rows={5}/>*/}
            {result && (
                <div className="mt-5 p-5 rounded bg-gray-50">
                    <table className="w-full border border-collapse table-auto">
                        <thead>
                        <tr>
                            {result.columns?.map((column, index) => (
                                <th key={index} className="text-center border font-mono font-bold">{column}</th>))}
                        </tr>
                        </thead>
                        <tbody>
                        {result.data?.map((row, index) => (
                            <tr key={index}>
                                {row.map((value, i) => (<td key={i} className="border font-mono text-center">{value}</td>))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
            {error && (
                <p className="mt-5 p-5 rounded text-md bg-red-100 text-red-500">
                    {error}
                </p>
            )}
        </div>);
}

export default function PadPage() {
    return (
        <div className="min-h-screen pt-20 bg-gray-50">
            <div className={`${styles.pad} container mx-auto bg-white rounded shadow-md p-5`}>
                <Cell/>
            </div>
        </div>
    )
}
