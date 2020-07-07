import React, { useState, useEffect } from 'react'
import { SquareLocation } from './AppContext'

import './square.css';

interface Props {
   location: SquareLocation
   isFirstClick: boolean,
   firstClickAction: Function,
   mineLocations: Array<SquareLocation>
}

const Square: React.FC<Props> = props => {
   const { location, mineLocations } = props;

   const [hasMine, setHasMine]         = useState(false);
   const [minesAround, setMinesAround] = useState(0);
   const [isOpen, setIsOpen]           = useState(false);

   useEffect(() => {
      const squaresAroundWithMine: SquareLocation[] = [];
      for (let i = 0; i < mineLocations.length; i++) {
         const currentSquare = mineLocations[i];
         if (JSON.stringify(currentSquare) === JSON.stringify(props.location)) {
            setHasMine(true);
         }
      }
      
      for (let x = location.x - 1; x <= location.x + 1; x++) {
         for (let y = location.y - 1; y <= location.y + 1; y++) {
            if (x !== location.x || y !== location.y) {
               const around = { x: x, y: y };
               mineLocations.forEach(loc => {
                  if (JSON.stringify(loc) === JSON.stringify(around))
                     squaresAroundWithMine.push(around);
               });
            }
         }
      }
      
      if (isOpen) {
         setMinesAround(squaresAroundWithMine.length);
         console.log(squaresAroundWithMine);
      }
      // console.log(squaresAround.length)
   }, [mineLocations, isOpen, props.location, location.x, location.y]);

   const hasMineStyle = {
      backgroundColor: 'red',
      color: 'white'
   }

   const isOpenStyle = {
      backgroundColor: 'white'
   }

   function clickSquareHandle(): void {
      if(props.isFirstClick) {
         props.firstClickAction(props.location);

      }
      setIsOpen(true);
   }

   return (
      <div 
         className='square-container d-flex justify-content-center align-items-center' 
         style={hasMine ? hasMineStyle : isOpen ? isOpenStyle : {}}
         onClick={clickSquareHandle}
      >
         {!isOpen && location.x + ',' + location.y}
         {isOpen && minesAround !== 0 && minesAround}
      </div>
   )
}

export default Square
