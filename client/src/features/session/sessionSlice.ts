import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Result} from "../../lib/api";

type Execution = {
    id: string,
    code: string,
    success: boolean,
    result?: Result,
    error?: string
};

export type SessionState = {
    sessionId?: string,
    cells: string[],
    cellData: Record<string, Execution>
}

const initialState: SessionState = {
    cells: [],
    cellData: {}
};

const {actions: {openComplete, endComplete}, reducer} = createSlice({
    name: 'session',
    initialState,
    reducers: {
        openComplete(state, action: PayloadAction<string>) {
            state.sessionId = action.payload
        },
        endComplete(state) {
            state.sessionId = undefined
        },
        addCell(state, action: PayloadAction<string>) {
            const id = action.payload
            state.cells.push(id)
            state.cellData[id] = {id, success: false, code: ""}
        },
        updateCell(state, action: PayloadAction<Execution>) {
            const id = action.payload.id
            state.cellData[id] = action.payload
        }
    }
});

export function openSession(sessionId: string) {
    return openComplete(sessionId);
}

export function closeSession() {
    return endComplete()
}

export default reducer
