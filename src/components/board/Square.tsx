import React, { useState, useEffect, useContext, SyntheticEvent } from 'react';
import AppContext, { InfoDetails, SquareLocation } from '../context/AppContext';
import { TiFlag } from 'react-icons/ti'
import { FaBomb } from 'react-icons/fa'

import './square.css';

interface Props {
   location: SquareLocation
   isFirstClick: boolean,
   firstClickAction: Function,
   id: string,
   getId: Function,
   squaresAround: string[],
   isInfoListFull: boolean,
   setIsInfoListFull: Function
}

const Square: React.FC<Props> = props => {
   const {
      mineLocations,
      infoList,
      setInfoList,
      numberCols,
      numberRows,
      isGameOver,
      setIsGameOver
   } = useContext(AppContext);

   const [isOpen, setIsOpen] = useState(false);
   const [hasMine, setHasMine] = useState(false);
   const [minesAround, setMinesAround] = useState(0);
   const [hasWarn, setHasWarn] = useState(false);
   const [bombClicked, setBombClicked] = useState(false);
   const [neighbourSquaresInfo, setNeighbourSquaresInfo] = useState<InfoDetails[]>([]);



   useEffect(() => {
      const list = infoList;
      const info = {
         id: props.id,
         isOpen,
         setIsOpen,
         hasBomb: hasMine,
         openNeighbourSquare: () => {
            if (!isOpen)
               setIsOpen(true);
         }
      }
      list.push(info);
      setInfoList(list);
   }, [hasMine, isOpen, props.id, setInfoList, infoList]);







   useEffect(() => {
      if (infoList.length === numberCols * numberRows) {
         props.setIsInfoListFull(true);
      }
   }, [infoList, numberCols, numberRows, props]);






   useEffect(() => {
      if (props.isInfoListFull) {
         const infos : InfoDetails[] = [];
         infoList.forEach(inf => {
            if (props.squaresAround.includes(inf.id))
               infos.push(inf)
         });
         setNeighbourSquaresInfo(infos);
      }
   }, [props.isInfoListFull, infoList, props.squaresAround]);






   useEffect(() => {
      if (isOpen && !hasMine) {
         neighbourSquaresInfo.forEach(inf => {
            if (!inf.hasBomb && minesAround === 0) {
               inf.openNeighbourSquare();
            }
         })
      }
   }, [isOpen, hasMine, minesAround, neighbourSquaresInfo]);







   useEffect(() => {
      mineLocations.forEach(loc => {
         if (loc === props.id) setHasMine(true)
      })

      let minesCount = 0;
      props.squaresAround.forEach(id => {
         if (mineLocations.includes(id)) minesCount++;
      });
      setMinesAround(minesCount);
   }, [mineLocations, props.id, props.squaresAround, infoList]);





   useEffect(() => {
      if (hasMine) setIsOpen(true);
   }, [isGameOver]);
   




   

   /**
    * Square Click handle function
    */
   function clickSquareHandle() : void {
      if (!isGameOver) {
         if (props.isFirstClick)
            props.firstClickAction(props.location, props.squaresAround)

         if (!isOpen) {
            setIsOpen(true);
         }

         if (hasMine) {
            setIsGameOver(true);
            setBombClicked(true);
         }
      }
   }





   /**
    * Square Right-Click handle function
    */
   function rightClickSquareHandle(e: SyntheticEvent) : void {
      e.preventDefault();
      if (!isGameOver) {
         if (!isOpen) setHasWarn(!hasWarn)
      }
   }






   // Styles
   function getStyle() {
      let defaultBg = '#77A4F8'
      let style = {
         backgroundColor: defaultBg,
         cursor: 'pointer',
         color: 'black',
         transition: '.6s'
      };

      if (isOpen) {
         style.backgroundColor = 'white'
         style.cursor = 'inherit'
         if (!hasMine) {
            switch(minesAround) {
               case 1:
                  style.color = '#0075A2'    // Celadon Blue
                  break;
               case 2:
                  style.color = '#30B33F'    // Green Pantone
                  break;
               case 3:
                  style.color = '#DD1100' //'#C8A527'    // Space Cadet
                  break;
               case 4:
                  style.color = '#a31a73'    // Maize Crayola
                  break;
               case 5:
                  style.color = '#F26419'    // Safety Orange Blaze Orange
                  break;
               case 6:
                  style.color = '#5B5941'    // Rifle Green (Gray color)
                  break;
               case 7:
                  style.color = '#87B6A7'    // Green Sheen (light blue color)
                  break;
               case 8:
                  style.color = '#0035B2'    // Opera Mauve
                  break;
               default:
                  style.color = 'white';
                  break;
            }
         }
         if (isGameOver && hasMine) {
            style.color = bombClicked ? 'white' : 'black'
            style.backgroundColor = bombClicked ? '#c00' : defaultBg
            style.transition = '0'
         }
      }
      else {
         if (hasWarn) style.backgroundColor = 'yellow'
      }
      
      return style
   }




   
   return (
      <div 
         className='square-container d-flex justify-content-center align-items-center' 
         style={getStyle()}
         onClick={clickSquareHandle}
         onContextMenu={e => rightClickSquareHandle(e)}
      >
         {
            // props.id
         }
         {
            isOpen && minesAround > 0 && !hasMine ?
               minesAround :
               isOpen && hasMine ? <FaBomb /> : null
         }
         {
            !isOpen && hasWarn ?
            <TiFlag /> :
            null
         }
      </div>
   )
}

export default Square
