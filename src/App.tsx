import React, { useState } from 'react';
import { ContextProvider, ContextConsumer } from './components/AppContext';
import Board from './components/Board';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {

   const [numberRows, setNumberRows]         = useState(10);
   const [numberCols, setNumberCols]         = useState(15);
   const [mines, setMines]                   = useState(20);
   const [mineLocations, setMineLocations]   = useState([]);
   const [infoList, setInfoList]             = useState([]);
   const [isGameOver, setIsGameOver]         = useState(false);

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
         isGameOver,
         setIsGameOver
         }}>
         <div className="App d-flex justify-content-center align-items-center">
            <ContextConsumer>
               {
                  context => context && (
                     <Board 
                        numberRows={context.numberRows} 
                        numberCols={context.numberCols}
                     />
                  )
               }
            </ContextConsumer>
         </div>
      </ContextProvider>
   );
}

export default App;
