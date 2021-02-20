import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store";
import {executeSql} from "../../lib/api";
import {closeSession, openSession, SessionState} from "./sessionSlice";

export function useSession() {
    const session = useSelector<RootState, SessionState>(state => state.session);
    const dispatch = useDispatch();

    const startSession = (dsn: string) => {
        dispatch(openSession(dsn))
    };

    const isActive = !!session.sessionId;

    const endSession = () => {
        dispatch(closeSession());
    };

    const execute = async (sql:string) => {
        return executeSql(session.sessionId!, sql);
    }

    return {session, isActive, startSession, endSession, execute};
}

