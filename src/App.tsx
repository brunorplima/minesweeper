import React, { useState } from 'react';
import { ContextProvider } from './components/context/AppContext';
import Game from './components/Game';
import { EASY } from './constants/constants'
import { TimeRecord, InfoDetails, GameOver } from './components/context/AppContext'

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {

   const [numberRows, setNumberRows]               = useState(10);
   const [numberCols, setNumberCols]               = useState(15);
   const [mines, setMines]                         = useState(30);
   const [mineLocations, setMineLocations]         = useState<string[]>([]);
   const [infoList, setInfoList]                   = useState<InfoDetails[]>([]);
   const [isMainMenu, setIsMainMenu]               = useState(true);
   const [isGameOver, setIsGameOver]               = useState<GameOver>({isIt: false, status: ''});
   const [easyTimeRecords, setEasyTimeRecords]     = useState<TimeRecord[]>([]);
   const [mediumTimeRecords, setMediumTimeRecords] = useState<TimeRecord[]>([]);
   const [expertTimeRecords, setExpertTimeRecords] = useState<TimeRecord[]>([]);
   const [level, setLevel]                         = useState<string>(EASY);

   return (
      <ContextProvider value={{
         numberRows,
         setNumberRows,
         numberCols,
         setNumberCols,
         mines,
         setMines,
         mineLocations,
         setMineLocations,
         infoList,
         setInfoList,
         isMainMenu,
         setIsMainMenu,
         isGameOver,
         setIsGameOver,
         level,
         setLevel,
         easyTimeRecords,
         setEasyTimeRecords,
         mediumTimeRecords,
         setMediumTimeRecords,
         expertTimeRecords,
         setExpertTimeRecords
         }}>
         <div className="App">
            <Game />
         </div>
      </ContextProvider>
   );
}

export default App;
