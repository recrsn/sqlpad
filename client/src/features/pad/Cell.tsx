import CodeMirror, { basicSetup } from '@uiw/react-codemirror';
import { keymap } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"

import { sql, PostgreSQL } from '@codemirror/lang-sql'
import usePadStore from "./padStore";
import { executeSql } from "../../lib/api";
import useSessionStore from '../session/sessionStore';
import { ReactComponent as PlayCircleOutline } from '../../images/play-outline.svg';
import { ReactComponent as TrashOutline } from '../../images/trash-outline.svg';

type CellProps = { id: string }

export default function Cell({ id }: CellProps) {
    const sessionId = useSessionStore(state => state.sessionId);
    const [addCell, removeCell, beginExecute, updateCellCode, updateCellResult] = usePadStore(state => [
        state.addCell,
        state.removeCell,
        state.beginExecute,
        state.updateCellCode,
        state.updateCellResult
    ]);

    const { code, result, status, error } = usePadStore(state => state.cellValues[id]);


    const executeCode = async (sql: string) => {
        beginExecute(id, sql);
        try {
            const result = await executeSql(sessionId!, sql)
            updateCellResult(id, { success: true, result })
        } catch (e: any) {
            console.log(e)
            updateCellResult(id, { success: false, error: e.message })
        }
    }

    const onChange = (code: string) => {
        updateCellCode(id, code)
    }

    const keyBindings = [
        {
            key: 'Shift-Enter',
            run() {
                console.log('Shift-Enter')
                executeCode(code);
                return true;
            }
        },
        {
            key: 'Mod-Enter',
            run() {
                console.log('Ctrl-Enter')
                executeCode(code)
                addCell()
                return true
            },
        },
        ...defaultKeymap
    ]

    return (
        <div className="py-2">
            <div className="border-solid border-gray-100">
                <div className="flex flex-row">
                    <div className="flex-grow">
                    </div>
                    <div className="flex-none">
                        <button className="bg-green-500 hover:bg-green-700 text-white p-2 rounded m-1" onClick={() => executeCode(code)}>
                            <PlayCircleOutline width={16} height={16} />
                        </button>
                        <button className="bg-red-500 hover:bg-red-700 text-white p-2 rounded m-1 mr-0" onClick={() => removeCell(id)}>
                            <TrashOutline width={16} height={16} />
                        </button>
                    </div>
                    {status === "pending" && (
                        <div>Executing...</div>
                    )}
                </div>
                <CodeMirror
                    value={code}
                    basicSetup={{
                        defaultKeymap: false
                    }}
                    extensions={[
                        sql({ dialect: PostgreSQL }),
                        keymap.of(keyBindings)
                    ]}
                    onChange={onChange}
                />
            </div>
            {result && (
                <div className="mt-5 p-5 rounded bg-gray-50">
                    <table className={`${result.columns && result.columns.length > 5 ? 'w-full' : ''} border border-collapse table-auto`}>
                        <thead>
                            <tr>
                                {result.columns?.map((column, index) => (
                                    <th key={index} className="text-center border font-mono font-bold">{column}</th>))}
                            </tr>
                        </thead>
                        <tbody>
                            {result.data?.map((row, index) => (
                                <tr key={index}>
                                    {row.map((value, i) => (
                                        <td key={i} className="border font-mono text-center">{value}</td>))}
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