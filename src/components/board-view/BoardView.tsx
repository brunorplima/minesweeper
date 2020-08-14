import React, { useState, useEffect, useContext, SyntheticEvent, useRef } from 'react'
import Board from '../board/Board'
import AppContext, { TimeRecord } from '../context/AppContext'
import { FaBomb } from 'react-icons/fa'
import { WON, EASY, MEDIUM } from '../../constants/constants'
import GameOverWindow from './GameOverWindow'
import HelpWindow from './HelpWindow'

import './board-view.css'
import { addToDatabase, sortRecords } from '../../firebase/firebase'

const BoardView: React.FC<any> = props => {

   const {
      isGameOver,
      setIsGameOver,
      isMainMenu,
      setIsMainMenu,
      setMineLocations,
      setInfoList,
      mines,
      easyTimeRecords,
      mediumTimeRecords,
      expertTimeRecords,
      level
   } = useContext(AppContext);

   const [seconds, setSeconds] = useState(0);
   const [minutes, setMinutes] = useState(0);
   const [isFirstClick, setIsFirstClick] = useState(true);
   const [renewGame, setRenewGame] = useState(false);
   const [isInfoListFull, setIsInfoListFull] = useState(false);
   const [warnSquares, setWarnSquares] = useState(0);
   const [openConfirm, setOpenConfirm] = useState({isIt: false, type: ''});
   const [openHelp, setOpenHelp] = useState(false);
   const [isRecord, setIsRecord] = useState(false);
   const [name, setName] = useState('');

   const timeout = useRef(setTimeout(() => '', 1));
   const openSquares = useRef(-1);

   /**
    * When the game is over and the player won sets the isRecord state which will tell if the time is a new record
    */
   useEffect(() => {
      if (isGameOver.isIt && isGameOver.status === WON) {
         const newRecord: TimeRecord = {
            name: '',
            seconds,
            minutes,
            date: Date.now()
         }
         setIsRecord(props.isNewRecord(getLevelRecords(), newRecord));
      }
   }, [isGameOver.isIt, isGameOver.status]);



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



   function getLevelRecords() {
      switch(level) {
         case EASY:
            return easyTimeRecords
         case MEDIUM:
            return mediumTimeRecords;
         default:
            return expertTimeRecords;
      }
   }



   function getTime() {
      const sec = seconds < 10 ? `0${seconds}` : `${seconds}`;
      const min = minutes < 10 ? `0${minutes}` : `${minutes}`;
      return `${min}:${sec}`;
   }


   function getPosition() {
      const newRecord: TimeRecord = {
         name: '',
         seconds,
         minutes,
         date: Date.now()
      }
      const records = sortRecords(getLevelRecords().concat(newRecord));
      let position = 0;
      records.forEach((val, i) => {
         if (val.date === newRecord.date) position = i + 1;
      })
      return position;
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
      openSquares.current = -1;
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


   function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
      e.preventDefault();
      setName(e.target.value);
   }


   function handleOnClick(e: SyntheticEvent) {
      e.preventDefault();
      const date = Date.now();
      const record: TimeRecord = {
         name,
         seconds,
         minutes,
         date
      }
      if (getLevelRecords().length >= 10) addToDatabase(level, record);
      else addToDatabase(level, record);
      setIsRecord(false);
   }


   return (
      <div className='d-flex flex-column justify-content-center align-items-center'>
         {
            !isGameOver.isIt && openHelp &&
            <HelpWindow setOpenHelp={setOpenHelp} />
         }

         {
            isGameOver.isIt && !isMainMenu ?
               <GameOverWindow 
                  getTime={getTime}
                  handleNameChange={handleNameChange}
                  handleOnClick={handleOnClick}
                  setNewGame={setNewGame}
                  goToMainMenu={goToMainMenu}
                  isRecord={isRecord}
                  getPosition={getPosition}
               /> :
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
