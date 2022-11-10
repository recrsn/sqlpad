import create from 'zustand'
import { Result } from "../../lib/api";
import { randomId } from "../../lib/utils";

type CellStatus = "idle" | "pending" | "success" | "error";

export type CellValue = {
    id: string,
    code: string,
    status: CellStatus,
    result?: Result,
    error?: string
};

type CellResult = {
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

type PadStore = PadState & {
    addCell: () => void,
    removeCell: (id: string) => void
    updateCellCode: (id: string, code: string) => void,
    beginExecute: (id: string, code: string) => void,
    updateCellResult: (id: string, result: CellResult) => void
}

const usePadStore = create<PadStore>((set) => ({
    ...initialState,

    addCell(cellId?: string) {
        const id = cellId || randomId();
        set((state) => ({
            cells: [...state.cells, id],
            cellValues: {
                ...state.cellValues,
                [id]: {
                    id,
                    code: '',
                    status: "idle",
                }
            }
        }));
    },
    removeCell(cellId: string) {
        set((state) => {
            const cells = state.cells.filter((id) => id !== cellId);
            const cellValues = { ...state.cellValues };
            delete cellValues[cellId];
            return { cells, cellValues };
        });
    },
    beginExecute(cellId: string, code: string) {
        set((state) => ({
            cellValues: {
                ...state.cellValues,
                [cellId]: {
                    id: cellId,
                    code,
                    status: "pending",
                }
            }
        }));
    },
    updateCellCode(id, code) {
        set((state) => ({
            cellValues: {
                ...state.cellValues,
                [id]: {
                    ...state.cellValues[id],
                    code
                }
            }
        }));
    },
    updateCellResult(id: string, result: CellResult) {
        set((state) => ({
            cellValues: {
                ...state.cellValues,
                [id]: {
                    ...state.cellValues[id],
                    ...result,
                    status: result.success ? "success" : "error"
                }
            }
        }));
    },
}));

export default usePadStore;