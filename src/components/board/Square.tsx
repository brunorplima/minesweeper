import React, { useState, useEffect, useContext, SyntheticEvent, Dispatch, SetStateAction, useRef } from 'react';
import AppContext, { InfoDetails, SquareLocation, WindowSize } from '../context/AppContext';
import { TiFlag } from 'react-icons/ti'
import { FaBomb } from 'react-icons/fa'
import { WON, LOST } from '../../constants/constants'

import './square.css';

interface Props {
   location: SquareLocation
   isFirstClick: boolean,
   firstClickAction: Function,
   id: string,
   getId: Function,
   squaresAround: string[],
   isInfoListFull: boolean,
   setIsInfoListFull: Dispatch<SetStateAction<boolean>>,
   openSquares: React.MutableRefObject<number>,
   setWarnSquares: Dispatch<SetStateAction<number>>
   screenSize: WindowSize
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
   const [openedAdded, setOpenedAdded] = useState(false);
   const [hasMine, setHasMine] = useState(false);
   const [minesAround, setMinesAround] = useState(0);
   const [hasWarn, setHasWarn] = useState(false);
   const [bombClicked, setBombClicked] = useState(false);
   const [neighbourSquaresInfo, setNeighbourSquaresInfo] = useState<InfoDetails[]>([]);


   /**
    * All cases only occurres if the square is open
    * 1. Sets openedAdded and decrease by one props.openSquares
    * 2. If this square doesn't have bomb and props.openSquares is equal to zero, sets gameOver to true with status WON
    * 3. if this square hasBomb sets gameOver to true with status LOST
    */
   useEffect(() => {
      if (isOpen) {
         if (!openedAdded) {
            setOpenedAdded(true);
            props.openSquares.current--
         }

         const gameOver = {
            isIt: true,
            status: WON
         }
         
         if (props.openSquares.current === 0 && !hasMine) {
            setIsGameOver(gameOver);
         } else if (props.openSquares.current === 0 && hasMine) {
            gameOver.status = LOST
            setIsGameOver(gameOver);
         }
      }
   }, [isOpen]);



   /**
    * Populate the infoList array to be used later on
    */
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






   /**
    * Set isInfoListFull to true in order to run the next useEffect
    */
   useEffect(() => {
      if (infoList.length === numberCols * numberRows) {
         props.setIsInfoListFull(true);
      }
   }, [infoList, numberCols, numberRows, props]);





   /**
    * Set the list which holds the information and open functionality of the squares around
    * This is going to be used to open squares around if this square has no bomb around
    */
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





   /**
    * Open squares around if:
    *    a) this square was opened
    *    b) this square does not have a bomb
    *    c) this square does not have bomb around it
    *    d) optional: the adjacent square does not have a bomb in it
    */
   useEffect(() => {
      if (isOpen && !hasMine && minesAround === 0) {
         neighbourSquaresInfo.forEach(inf => {
            if (!inf.hasBomb) {
               inf.openNeighbourSquare();
            }
         })
      }
   }, [isOpen, hasMine, minesAround, neighbourSquaresInfo]);




   // useEffect(() => {
   //    if (!isNull(props.openSquares)) {
   //       if (props.openSquares === 120) console.log(props.openSquares)
   //       if (props.openSquares === 0) {
   //          setIsGameOver(true);
   //       }

   //       if (isOpen && !openedAdded) {
   //          const free = props.openSquares - 1;
   //          props.setOpenSquares(free);
   //          setOpenedAdded(true);
   //       }
   //    }
   // }, [props.openSquares, isOpen, props.setOpenSquares, setIsGameOver, openedAdded]);



   /**
    * Place bomb in this square if its id is included within mineLocations array
    * Sets the number of bombs around
    */
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




   /**
    * Open all squares with bombs if the game is over
    */
   useEffect(() => {
      if (hasMine && isGameOver.isIt) setIsOpen(true);
   }, [isGameOver.isIt, hasMine]);



   /**
    * Increase or decrease the number of flagged squares
    */
   useEffect(() => {
      if (!props.isFirstClick) {
         if (hasWarn) props.setWarnSquares(prevState => prevState + 1)
         else props.setWarnSquares(prevState => prevState - 1)
      }
   }, [hasWarn, props]);
   




   

   /**
    * Square Click handle function
    */
   function clickSquareHandle() : void {
      if (!isGameOver.isIt && !hasWarn) {
         if (props.isFirstClick)
            props.firstClickAction(props.location, props.squaresAround)

         if (!isOpen) {
            setIsOpen(true);
         }

         if (hasMine) {
            const gameOver = {
               isIt: true,
               status: LOST
            } 
            setIsGameOver(gameOver);
            setBombClicked(true);
         }
      }
   }





   /**
    * Square Right-Click handle function
    */
   function rightClickSquareHandle(e: SyntheticEvent) : void {
      e.preventDefault();
      if (!isGameOver.isIt && !props.isFirstClick) {
         if (!isOpen) setHasWarn(!hasWarn)
      }
   }



   const isTouchEnded = useRef(false);
   const touchTimeout = useRef(setTimeout(() => '', 1));
   function touchStartHandle(e: SyntheticEvent) : void {
      e.preventDefault();
      touchTimeout.current = setTimeout(() => {
         isTouchEnded.current = true;
      }, 300);
   }

   function touchEndHandle(e: SyntheticEvent) : void {
      e.preventDefault();
      clearTimeout(touchTimeout.current);
      if (isTouchEnded.current && !props.isFirstClick) {
         setHasWarn(!hasWarn);
      } else {
         clickSquareHandle()
      }
      isTouchEnded.current = false;
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
         if (isGameOver.isIt && hasMine) {
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
         onTouchStart={e => touchStartHandle(e)}
         onTouchEnd={e => touchEndHandle(e)}
      >
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
