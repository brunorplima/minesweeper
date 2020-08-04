import React, { useState } from 'react';
import { ContextProvider } from './components/context/AppContext';
import Game from './components/Game';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {

   const [numberRows, setNumberRows]         = useState(10);
   const [numberCols, setNumberCols]         = useState(15);
   const [mines, setMines]                   = useState(30);
   const [mineLocations, setMineLocations]   = useState([]);
   const [infoList, setInfoList]             = useState([]);
   const [isMainMenu, setIsMainMenu]         = useState(true);
   const [isGameOver, setIsGameOver]         = useState({isIt: false, status: ''});

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
         setIsGameOver
         }}>
         <div className="App">
            <Game />
         </div>
      </ContextProvider>
   );
}

export default App;
