import React, {useState} from "react";
import {Controlled as CodeMirror} from "react-codemirror2";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store";
import {useSession} from "../session/sessionHooks";
import {beginExecute, CellValue, newCell, updateCellResult} from "./padSlice";

type CellProps = { id: string }

export default function Cell({id}: CellProps) {
    const {execute} = useSession();
    const dispatch = useDispatch()
    const {status, result, error} = useSelector<RootState, CellValue>(state => state.pad.cellValues[id])
    const [code, setCode] = useState("");

    const executeCode = async (sql: string) => {
        dispatch(beginExecute({id, code}))
        try {
            const result = await execute(sql)
            dispatch(updateCellResult({id, success: true, result}))
        } catch (e) {
            console.log(e)
            dispatch(updateCellResult({id, success: false, error: e.message}))
        }
    }

    const options = {
        mode: 'text/x-pgsql',
        lineNumbers: true,
        extraKeys: {
            'Shift-Enter': async () => {
                await executeCode(code);
            },
            'Ctrl-Enter': async () => {
                await executeCode(code)
                dispatch(newCell())
            },
            'Cmd-Enter': async () => {
                await executeCode(code)
                dispatch(newCell())
            },
        },
    }
    return (
        <div>
            <div className="border-solid border-gray-100">
                {status === "pending" && (
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
