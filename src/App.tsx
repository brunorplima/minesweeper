import React, { useState } from 'react';
import { ContextProvider, ContextConsumer } from './components/AppContext';
import Board from './components/Board';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {

   const [openSquares, setOpenSquares]       = useState([]);
   const [numberRows, setNumberRows]         = useState(16);
   const [numberCols, setNumberCols]         = useState(16);
   const [mines, setMines]                   = useState(30);
   const [mineLocations, setMineLocations]   = useState([]);
   
   const populateBoardWithMine = (): void => {
      const locations: Array<Object> = [];
      for (let i = 0; i < mines; i++) {
         const location = {
            x: Math.floor(Math.random() * numberCols),
            y: Math.floor(Math.random() * numberRows)
         }
         const validations: Array<boolean> = locations.map(loc => JSON.stringify(location) === JSON.stringify(loc));
         if (validations.includes(true)) {
            i--;
            continue;
         } else {
            locations.push(location);
         }
      }
      // setMineLocations(locations);
   }

   return (
      <ContextProvider value={{
         openSquares,
         setOpenSquares,
         numberRows,
         setNumberRows,
         numberCols,
         setNumberCols,
         mines,
         setMines,
         mineLocations,
         setMineLocations
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
