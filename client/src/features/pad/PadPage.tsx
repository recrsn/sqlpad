import { useEffect } from "react";
import Cell from "./Cell";
import usePadStore from "./padStore";
import { ReactComponent as AddCircleOutline } from '../../images/add-circle-outline.svg';

export default function PadPage() {
    const [cells, addCell] = usePadStore(state => [state.cells, state.addCell]);

    useEffect(() => {
        if (cells.length === 0) {
            addCell();
        }
    }, [])

    return (
        <div className="min-h-screen pt-20 bg-gray-50">
            <div className="container mx-auto bg-white rounded shadow-md p-2 mb-2">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={addCell}>
                    <AddCircleOutline width={16} height={16} />
                </button>
            </div>
            <div className={`container mx-auto bg-white rounded shadow-md px-2`}>
                {cells.map(cellId => <Cell key={cellId} id={cellId} />)}
            </div>
        </div>
    )
}
