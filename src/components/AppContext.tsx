import { createContext } from 'react'

export interface SquareLocation {
   x: number,
   y: number
}

interface Context {
   openSquares: Array<SquareLocation>,
   setOpenSquares: Function,
   numberRows: number,
   setNumberRows: Function,
   numberCols: number,
   setNumberCols: Function,
   mines: number,
   setMines: Function,
   mineLocations: Array<SquareLocation>,
   setMineLocations: Function
}

const context: Context = {
   openSquares: [],
   setOpenSquares: () => {},
   numberRows: 0,
   setNumberRows: () => {},
   numberCols: 0,
   setNumberCols: () => {},
   mines: 0,
   setMines: () => {},
   mineLocations: [],
   setMineLocations: () => {}
}

const AppContext = createContext<Context>(context);

export const ContextProvider = AppContext.Provider;

export const ContextConsumer = AppContext.Consumer;

export const resetContext = () => {
   
}

export default AppContext;
