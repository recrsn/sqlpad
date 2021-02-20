import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type SessionState = {
    sessionId?: string,
}

const initialState: SessionState = {};

const {actions: {openComplete, endComplete}, reducer} = createSlice({
    name: 'session',
    initialState,
    reducers: {
        openComplete(state, action: PayloadAction<string>) {
            state.sessionId = action.payload
        },
        endComplete(state) {
            state.sessionId = undefined
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
