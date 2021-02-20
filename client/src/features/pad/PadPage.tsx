import "codemirror/mode/sql/sql";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store";
import Cell from "./Cell";
import styles from './PadPage.module.css';
import {newCell, PadState} from "./padSlice";

export default function PadPage() {
    const {cells} = useSelector<RootState, PadState>(state => state.pad);
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(newCell())
    }, [dispatch])

    return (
        <div className="min-h-screen pt-20 bg-gray-50">
            <div className={`${styles.pad} container mx-auto bg-white rounded shadow-md p-5`}>
                {cells.map(cellId => <Cell key={cellId} id={cellId}/>)}
            </div>
        </div>
    )
}
