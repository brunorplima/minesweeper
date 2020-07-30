import React, { useState, useEffect, useContext, SyntheticEvent } from 'react'
import Board from '../board/Board'
import AppContext from '../context/AppContext'

import './board-view.css'
import { isFunction } from 'util'
import { isMainThread } from 'worker_threads'

const BoardView = () => {

   const {
      isGameOver,
      setIsGameOver,
      isMainMenu,
      setIsMainMenu,
      setMineLocations,
      setInfoList
   } = useContext(AppContext);

   const [seconds, setSeconds] = useState(0);
   const [minutes, setMinutes] = useState(0);
   const [isFirstClick, setIsFirstClick] = useState(true);
   const [renewGame, setRenewGame] = useState(false);
   const [isInfoListFull, setIsInfoListFull] = useState(false);

   useEffect(() => {
      if (!isGameOver && !isFirstClick) {
         const interval = setTimeout(() => {
            if (seconds !== 59) {
               setSeconds(seconds + 1);
            }
            else {
               setSeconds(0);
               setMinutes(minutes + 1)
            }
         }, 1000);
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


   function setNewGame(e: SyntheticEvent) {
      e.preventDefault();
      setIsGameOver(false);
      setIsFirstClick(true);
      setIsInfoListFull(false);
      setRenewGame(true);
      setMinutes(0);
      setSeconds(0);
      setMineLocations([]);
      setInfoList([]);
   }


   function goToMainMenu(e: SyntheticEvent) {
      e.preventDefault();
      setIsGameOver(false);
      setIsFirstClick(true);
      setIsInfoListFull(false);
      setIsMainMenu(true);
      setMineLocations([]);
      setInfoList([]);
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
                        className='btn btn-secondary'
                        onClick={e => setNewGame(e)}
                     >
                        New Game
                     </button>

                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                     <button 
                        className='btn btn-secondary'
                        onClick={e => goToMainMenu(e)}
                     >
                        Main Menu
                     </button>
                  </div>
               </div> :
               null
         }
         <div className='top-menu d-flex justify-content-center'>
            <div className='clock'>
               {getTime()}
            </div>
         </div>
         {
            !renewGame ? 
            <Board 
               isFirstClick={isFirstClick} 
               setIsFirstClick={setIsFirstClick}
               isInfoListFull={isInfoListFull}
               setIsInfoListFull={setIsInfoListFull}
            /> : 
            null
         }
      </div>
   )
}

export default BoardView
