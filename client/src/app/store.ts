import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import sessionReducer from '../features/session/sessionSlice';

export const store = configureStore({
    reducer: {
        session: sessionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
