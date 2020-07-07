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

   const [hasMine, setHasMine]   = useState(false);
   const [isOpen, setIsOpen]     = useState(false);

   useEffect(() => {
      for (let i = 0; i < props.mineLocations.length; i++) {
         if (JSON.stringify(props.mineLocations[i]) === JSON.stringify(props.location)) {
            setHasMine(true);
         }
      }
   }, [props.mineLocations]);

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
         {props.location.x + ',' + props.location.y}
      </div>
   )
}

export default Square
