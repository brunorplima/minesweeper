import { createContext } from 'react'

export interface SquareLocation {
   x: number,
   y: number
}

export interface InfoDetails {
   id: string,
   isOpen: boolean,
   setIsOpen: Function,
   hasBomb: boolean,
   openNeighbourSquare: Function
}

export interface WindowSize {
   width: number,
   height: number
}

export interface GameOver {
   isIt: boolean,
   status: string
}

export interface TimeRecord {
   name: string,
   minutes: number,
   seconds: number,
   date: number
}

interface Context {
   numberRows: number,
   setNumberRows: Function,
   numberCols: number,
   setNumberCols: Function,
   mines: number,
   setMines: Function,
   mineLocations: Array<string>,
   setMineLocations: Function,
   infoList: Array<InfoDetails>,
   setInfoList: Function,
   isMainMenu: boolean,
   setIsMainMenu: Function,
   isGameOver: {isIt: boolean, status: string},
   setIsGameOver: Function,
   level: string,
   setLevel: Function,
   easyTimeRecords: TimeRecord[],
   setEasyTimeRecords: Function,
   mediumTimeRecords: TimeRecord[],
   setMediumTimeRecords: Function,
   expertTimeRecords: TimeRecord[],
   setExpertTimeRecords: Function
}

const context: Context = {
   numberRows: 0,
   setNumberRows: () => {},
   numberCols: 0,
   setNumberCols: () => {},
   mines: 0,
   setMines: () => {},
   mineLocations: [],
   setMineLocations: () => {},
   infoList: [],
   setInfoList: () => {},
   isMainMenu: true,
   setIsMainMenu: () => {},
   isGameOver: {isIt: false, status: ''},
   setIsGameOver: () => {},
   level: '',
   setLevel: () => {},
   easyTimeRecords: [],
   setEasyTimeRecords: () => {},
   mediumTimeRecords: [],
   setMediumTimeRecords: () => {},
   expertTimeRecords: [],
   setExpertTimeRecords: () => {}
}

const AppContext = createContext<Context>(context);

export const ContextProvider = AppContext.Provider;

export const ContextConsumer = AppContext.Consumer;

export default AppContext;
