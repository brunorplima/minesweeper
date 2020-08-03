import React, { useEffect, useContext, ReactElement, useState } from 'react';
import AppContext, { ContextConsumer, SquareLocation, WindowSize } from '../context/AppContext';
import Square from './Square';
import { isNull } from 'util';

const Board: React.FC<any> = props => {
   const {
      numberRows,
      numberCols,
      mines,
      setMineLocations
   } = useContext(AppContext);


   const screenSize = useWindowSize();

   function useWindowSize() {
      const [windowSize, setWindowSize] = useState<WindowSize>({
         width: 0,
         height: 0
      })

      useEffect(() => {
         const handleResize = () => {
            setWindowSize({
               width: window.innerWidth,
               height: window.innerHeight
            })
         }

         window.addEventListener('resize', handleResize);

         if (!windowSize.width || !windowSize.height) handleResize();

         return () => window.removeEventListener('resize', handleResize);
      }, [windowSize.height, windowSize.width]);

      return windowSize;
   }

   /**
    * Returns the id of a square
    * 
    * @param x 
    * @param y 
    */
   function getId(x: number, y: number) : string {
      return `${x}-${y}`;
   }


   /**
    * Returns a list with the id of the surrounding squares of a given square
    * 
    * @param locationX 
    * @param locationY 
    */
   function getSurroundingSquareIds(locationX: number, locationY: number) : string[] {
      const sqround: string[] = [];
      for (let x = locationX - 1; x <= locationX + 1; x++) {
         for (let y = locationY - 1; y <= locationY + 1; y++) {
            const isDifferent = x !== locationX || y !== locationY;
            const isValidX = x >= 0 && x < numberRows;
            const isValidY = y >= 0 && y < numberCols;
            if (isDifferent && isValidX && isValidY)
            sqround.push(getId(x, y));
         }
      }
      return sqround;
   }


   /**
    * Function to be called when the first square is clicked.
    * It spread the mines on the board
    * 
    * @param location 
    * @param squaresAround 
    */
   function firstClickAction(location: SquareLocation, squaresAround: string[]) {
      props.setIsFirstClick(false);
      const newMineLocations = spreadMinesOnBoard(location, squaresAround)
      setMineLocations(newMineLocations);
   }

   
   /**
    * Spreads mines on board. Called within firstClickAction function.
    * 
    * @param location 
    * @param squaresAround 
    */
   function spreadMinesOnBoard(location: SquareLocation, squaresAround: string[]): string[] {
      const locations: string[] = [];
      for (let i = 0; i < mines; i++) {
         const loc: SquareLocation = {
            x: Math.floor(Math.random() * numberRows),
            y: Math.floor(Math.random() * numberCols)
         }
         const locId = getId(loc.x, loc.y);
         if (locations.includes(locId)) {
            i--;
            continue;
         }

         let locIsAround = false;
         squaresAround.forEach(id => {
            if (id === locId)
               locIsAround = true;
         });
         if (getId(location.x, location.y) !== locId && !locIsAround) {
            locations.push(locId);
         } else {
            i--;
         }
      }
      return locations;
   }


   /**
    * It builds each row to be placed on the board.
    * 
    * @param colNumber 
    */
   function buildRow(colNumber: number): Array<ReactElement> {
      const row: Array<ReactElement> = [];
      for (let x = 0; x < numberRows; x++) {
         const location = { x, y: colNumber };
         const id = getId(location.x, location.y);
         row.push(
            <Square
               key={id}
               getId={getId}
               squaresAround={getSurroundingSquareIds(location.x, location.y)}
               id={id}
               location={location}
               isFirstClick={props.isFirstClick}
               firstClickAction={firstClickAction}
               isInfoListFull={props.isInfoListFull}
               setIsInfoListFull={props.setIsInfoListFull}
               openSquares={props.openSquares}
               setWarnSquares={props.setWarnSquares}
               screenSize={screenSize}
            />
         );
      }
      
      return row;
   }


   /**
    * Builds all the rows and returns the board layout.
    */
   function buildBoard(): Array<Array<ReactElement>> {
      const rows: Array<Array<ReactElement>> = [];
      for (let i = 0; i < numberCols; i++) {
         rows.push(buildRow(i));
      }
      if (!props.openSquares.current) props.openSquares.current = numberRows * numberCols - mines;
      return rows;
   }

   console.log(props.openSquares.current)

   return (
      <div>
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
      </div>
   )
}

export default Board
