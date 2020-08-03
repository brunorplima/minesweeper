import React, { useState, useEffect, useContext, SyntheticEvent } from 'react'
import Board from '../board/Board'
import AppContext from '../context/AppContext'
import { FaBomb } from 'react-icons/fa'

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

   let timeout: ReturnType<typeof setTimeout>;

   useEffect(() => {
      if (!isGameOver && !isFirstClick) {
         timeout = setTimeout(() => {
            if (seconds !== 59) {
               setSeconds(seconds + 1);
            }
            else {
               setSeconds(0);
               setMinutes(minutes + 1)
            }
         }, 1000);
      }
      if (isGameOver) {
         clearTimeout(timeout);
      }
   }, [seconds, minutes, isGameOver, isFirstClick]);


   useEffect(() => {
      if (renewGame) setRenewGame(false);
   }, [renewGame]);



   function getTime() {
      const sec = seconds < 10 ? `0${seconds}` : `${seconds}`;
      const min = minutes < 10 ? `0${minutes}` : `${minutes}`;
      return `${min}:${sec}`;
   }

   function resetState() {
      setIsGameOver(false);
      setIsFirstClick(true);
      setIsInfoListFull(false);
      setMineLocations([]);
      setInfoList([]);
      setWarnSquares(0);
   }


   function setNewGame(e: SyntheticEvent) {
      e.preventDefault();
      resetState();
      setRenewGame(true);
      setMinutes(0);
      setSeconds(0);
      clearTimeout(timeout);
   }


   function goToMainMenu(e: SyntheticEvent) {
      e.preventDefault();
      resetState();
      setIsMainMenu(true);
   }


   return (
      <div className='d-flex flex-column justify-content-center align-items-center'>
         {
            isGameOver && !isMainMenu ?
               <div className='game-over-window'>
                  <div>Game Over!</div>
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
         <div className='top-menu d-flex justify-content-between w-100'>
            <div className='remaining-bombs d-flex align-items-center'>
               <FaBomb />
               &nbsp;
               {mines - warnSquares >= 0 ? mines - warnSquares : '--'}
            </div>

            <div className='clock'>
               {getTime()}
            </div>

            {/* <div>
               {mines - warnSquares >= 0 ? mines - warnSquares : '--'}
            </div> */}
         </div>
         
         {
            !renewGame ? 
            <Board 
               isFirstClick={isFirstClick} 
               setIsFirstClick={setIsFirstClick}
               isInfoListFull={isInfoListFull}
               setIsInfoListFull={setIsInfoListFull}
               setWarnSquares={setWarnSquares}
            /> : 
            null
         }

         <div className='bottom-menu w-100 d-flex justify-content-around'>
            <button 
               className='btn btn-primary'
               onClick={e => setNewGame(e)}
               disabled={isGameOver || isFirstClick}
            >
               New Game
            </button>

            <button 
               className='btn btn-light'
               onClick={e => goToMainMenu(e)}
               disabled={isGameOver}
            >
               Main Menu
            </button>
         </div>
      </div>
   )
}

export default BoardView
