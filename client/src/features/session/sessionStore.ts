import create from 'zustand'


export type SessionState = {
    sessionId: string | null,
}

const initialState: SessionState = {
    sessionId: null,
};

type SessionStore = SessionState & {
    open(sessionId: string): void,
    end(): void,
}

const useSessionStore = create<SessionStore>((set) => ({
    ...initialState,

    open(sessionId: string) {
        set({ ...initialState, sessionId });
    },
    end() {
        set({ ...initialState });
    },
}));

export default useSessionStore;
