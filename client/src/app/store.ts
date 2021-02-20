import {configureStore} from '@reduxjs/toolkit';
import padReducer from "../features/pad/padSlice";
import sessionReducer from '../features/session/sessionSlice';

export const store = configureStore({
    reducer: {
        session: sessionReducer,
        pad: padReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
