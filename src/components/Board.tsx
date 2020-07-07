import React, { useEffect, useState, useContext, ReactElement } from 'react';
import AppContext, { ContextConsumer, SquareLocation } from './AppContext';
import Square from './Square';

const Board: React.FC<any> = props => {
   const {
      numberRows,
      numberCols,
      mines, 
      mineLocations,
      setMineLocations } = useContext(AppContext);
   const [isFirstClick, setIsFirstClick] = useState(true);

   useEffect(() => {
      // console.log('props.isFirstClick:', isFirstClick);
      // console.log(typeof setMineLocations);
      // console.log(mineLocations);
      // setMineLocations([{x:3, y:12}, {x:10, y:7}, {x:8, y:4}]);
   }, []);

   useEffect(() => {
      
      console.log(isFirstClick);
   });

   function firstClickAction(location: SquareLocation) {
      setIsFirstClick(false);
      setMineLocations(spreadMinesOnBoard(location));
   }

   function spreadMinesOnBoard(location: SquareLocation): SquareLocation[] {
      const locations: SquareLocation[] = [];
      for (let i = 0; i < mines; i++) {
         const loc: SquareLocation = {
            x: Math.floor(Math.random() * numberCols),
            y: Math.floor(Math.random() * numberRows)
         }
         const checkRepetition = locations.filter(val => JSON.stringify(val) === JSON.stringify(loc));
         if (!checkRepetition.length && JSON.stringify(location) !== JSON.stringify(loc)) {
            locations.push(loc);
         } else {
            i--;
         }
      }
      return locations;
   }

   function buildRow(colNumber: number): Array<ReactElement> {
      const row: Array<ReactElement> = [];
      for (let i = 0; i < props.numberRows; i++) {
         const location = { x: i, y: colNumber };
         row.push(
            <Square
               location={location}
               isFirstClick={isFirstClick}
               firstClickAction={firstClickAction}
               mineLocations={mineLocations}
            />
         );
      }
      
      return row;
   }

   function buildBoard(): Array<Array<ReactElement>> {
      const rows: Array<Array<ReactElement>> = [];
      for (let i = 0; i <props.numberCols; i++) {
         rows.push(buildRow(i));
      }

      return rows;
   }

   return (
      <ContextConsumer>
         {
            appContext => appContext && (
               <div className='board-container'>
                  {
                     buildBoard().map((row, i) => {
                        return (
                           <div key={i} className='d-flex'>
                              {row}
                           </div>
                        )
                     })
                  }
               </div>
            )
         }
      </ContextConsumer>
   )
}

export default Board
