import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store";
import {executeSql} from "../../lib/api";
import {closeSession, openSession, SessionState} from "./sessionSlice";

export function useSession() {
    const {sessionId} = useSelector<RootState, SessionState>(state => state.session);
    const dispatch = useDispatch();

    const startSession = (dsn: string) => {
        dispatch(openSession(dsn))
    };

    const isActive = !!sessionId;

    const endSession = () => {
        dispatch(closeSession());
    };

    const execute = async (sql:string) => {
        return executeSql(sessionId!, sql);
    }

    return {sessionId, isActive, startSession, endSession, execute};
}

