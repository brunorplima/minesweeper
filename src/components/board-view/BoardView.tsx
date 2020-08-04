import React, { useState, useEffect, useContext, SyntheticEvent, useRef } from 'react'
import Board from '../board/Board'
import AppContext from '../context/AppContext'
import { FaBomb } from 'react-icons/fa'
import { GrFormClose } from 'react-icons/gr'
import { WON } from '../../constants/constants'

import './board-view.css'

const BoardView = () => {

   const {
      isGameOver,
      setIsGameOver,
      isMainMenu,
      setIsMainMenu,
      setMineLocations,
      setInfoList,
      mines
   } = useContext(AppContext);

   const [seconds, setSeconds] = useState(0);
   const [minutes, setMinutes] = useState(0);
   const [isFirstClick, setIsFirstClick] = useState(true);
   const [renewGame, setRenewGame] = useState(false);
   const [isInfoListFull, setIsInfoListFull] = useState(false);
   const [warnSquares, setWarnSquares] = useState(0);
   const [openConfirm, setOpenConfirm] = useState({isIt: false, type: ''});
   const [openHelp, setOpenHelp] = useState(false);

   const timeout = useRef(setTimeout(() => '', 1));
   const openSquares = useRef(0);

   useEffect(() => {
      if (!isGameOver.isIt && !isFirstClick) {
         timeout.current = setTimeout(() => {
            if (seconds !== 59) {
               setSeconds(seconds + 1);
            }
            else {
               setSeconds(0);
               setMinutes(minutes + 1)
            }
         }, 1000);
      }
      if (isGameOver.isIt) {
         clearTimeout(timeout.current);
      }
   }, [seconds, minutes, isGameOver.isIt, isFirstClick]);


   useEffect(() => {
      if (renewGame) setRenewGame(false);
   }, [renewGame]);



   function getTime() {
      const sec = seconds < 10 ? `0${seconds}` : `${seconds}`;
      const min = minutes < 10 ? `0${minutes}` : `${minutes}`;
      return `${min}:${sec}`;
   }

   function resetState() {
      const gameOver = {
         isIt: false,
         status: ''
      }
      setIsGameOver(gameOver);
      setIsFirstClick(true);
      setIsInfoListFull(false);
      setMineLocations([]);
      setInfoList([]);
      setWarnSquares(0);
      openSquares.current = 0;
   }


   function setNewGame(e: SyntheticEvent) {
      e.preventDefault();
      resetState();
      setRenewGame(true);
      setMinutes(0);
      setSeconds(0);
      clearTimeout(timeout.current);
   }


   function goToMainMenu(e: SyntheticEvent) {
      e.preventDefault();
      resetState();
      setIsMainMenu(true);
   }


   function openEndGameConfirmationWindow(e: SyntheticEvent, button: string) {
      if (isFirstClick) goToMainMenu(e);
      
      else {
         const confirm = {
            isIt: true,
            type: button
         }
         setOpenConfirm(confirm);
      }
   }

   function endGameButtonClick(e: SyntheticEvent, button: string) {
      if (button) {
         if (openConfirm.type === 'mainMenu') goToMainMenu(e);
         else setNewGame(e);
      }
      const confirm = {
         isIt: false,
         type: ''
      }
      setOpenConfirm(confirm);
   }


   function helpButtonClick() {
      if (!isGameOver.isIt) {
         setOpenHelp(true)
      }
   }


   return (
      <div className='d-flex flex-column justify-content-center align-items-center'>
         {
            !isGameOver.isIt && openHelp &&
            <div className='help-window'>
               <div className='close-window' onClick={e => setOpenHelp(false)}>
                  <GrFormClose style={{color:'white'}}/>
               </div>
               <div className='hw-mobile'>
                  <div>Mobile:</div>
                  <div> - Touch to open a square</div>
                  <div> - Touch and hold to flag a square</div>
               </div>
               <div className='hw-desktop'>
                  <div>Desktop:</div>
                  <div> - Left-click to open a square</div>
                  <div> - Right-click to flag a square</div>
               </div>
               <div>Goal: Open all squares without opening a square with a bomb in it. Once all non-bomb squares are opened you win the game. Open a square with a bomb in it and you lose the game.</div>
               <div>The numbered squares mean there is/are that many bomb/bombs within the 8 squares around them.</div>
               <div>Use the flags to warn yourself that you found out that a given square has a bomb in it.</div>
               <div>Have fun!</div>
            </div>
         }

         {
            isGameOver.isIt && !isMainMenu ?
               <div className='game-over-window'>
                  <div>{isGameOver.status === WON ? 'Congratulation, you WON!' : 'Game Over!'}</div>
                  <div>Time: {getTime()}</div>
                  <div className='game-over-options'>
                     <button 
                        className='btn btn-primary'
                        onClick={e => setNewGame(e)}
                     >
                        New Game
                     </button>

                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                     <button 
                        className='btn btn-light'
                        onClick={e => goToMainMenu(e)}
                     >
                        Main Menu
                     </button>
                  </div>
               </div> :
               null
         }

         {
            openConfirm.isIt &&
               <div className='end-game-confirmation'>
                  <div>Your progress will be lost</div>
                  <div>Proceed?</div>
                  <div className='egc-buttons w-100 d-flex justify-content-around'>
                     <button className='btn btn-warning' onClick={e => endGameButtonClick(e, 'yes')}>Yes</button>
                     <button className='btn btn-light' onClick={e => endGameButtonClick(e, '')}>Cancel</button>
                  </div>
               </div>
         }

         <div className='top-menu d-flex justify-content-between w-100'>
            <div className='remaining-bombs d-flex align-items-center'>
               <FaBomb />
               &nbsp;
               {mines - warnSquares >= 0 ? mines - warnSquares : '--'}
            </div>

            <div className='clock'>
               {getTime()}
            </div>

            <div className='help d-flex align-items-center' onClick={helpButtonClick}>
               Help
            </div>
         </div>
         
         {
            !renewGame ? 
            <Board 
               isFirstClick={isFirstClick} 
               setIsFirstClick={setIsFirstClick}
               isInfoListFull={isInfoListFull}
               setIsInfoListFull={setIsInfoListFull}
               setWarnSquares={setWarnSquares}
               openSquares={openSquares}
            /> : 
            null
         }

         <div className='bottom-menu w-100 d-flex justify-content-around'>
            <button 
               className='btn btn-primary'
               onClick={e => openEndGameConfirmationWindow(e, 'newGame')}
               disabled={isGameOver.isIt || isFirstClick}
            >
               New Game
            </button>

            <button 
               className='btn btn-light'
               onClick={e => openEndGameConfirmationWindow(e, 'mainMenu')}
               disabled={isGameOver.isIt}
            >
               Main Menu
            </button>
         </div>
      </div>
   )
}

export default BoardView
