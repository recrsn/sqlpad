import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Result} from "../../lib/api";
import {randomId} from "../../lib/utils";

type CellStatus = "idle" | "pending" | "success" | "error";

export type CellValue = {
    id: string,
    code: string,
    status: CellStatus,
    result?: Result,
    error?: string
};

type ExecutePayload = {
    id: string,
    code: string,
}

type CellResultPayload = {
    id: string,
    success: boolean,
    result?: Result,
    error?: string
}


export type PadState = {
    cells: string[],
    cellValues: Record<string, CellValue>
}

const initialState: PadState = {
    cells: [],
    cellValues: {}
};

const {actions, reducer} = createSlice({
    name: 'pad',
    initialState,
    reducers: {
        addCell(state, action: PayloadAction<string>) {
            const id = action.payload
            state.cells.push(id)
            state.cellValues[id] = {id, code: "", status: "idle"}
        },
        removeCell(state, action: PayloadAction<string>) {
            const id = action.payload
            state.cells = state.cells.filter(id => id !== action.payload)
            if (state.cellValues[id]) {
                delete state.cellValues[id]
            }
        },
        beginExecute(state, action: PayloadAction<ExecutePayload>) {
            const {id, code} = action.payload
            const value = state.cellValues[id]
            value.code = code
            value.status = "pending"
            value.result = undefined
            value.error = undefined
        },
        updateCellResult(state, action: PayloadAction<CellResultPayload>) {
            const {id, success, result, error} = action.payload
            const value = state.cellValues[id]
            value.status = success ? "success" : "error"
            value.result = result
            value.error = error
        },
    }
});

export const {addCell, beginExecute, updateCellResult, removeCell} = actions;
export default reducer

export function newCell() {
    const id = randomId()
    return addCell(id)
}
