import React, { useEffect, useState, useContext } from 'react'
import AppContext from './context/AppContext'
import Board from './board/Board'
import MainMenu from './main-menu/MainMenu'

import './game.css'

const Game = () => {

   const {
      isMainMenu
   } = useContext(AppContext);

   return (
      <div className='game-container d-flex justify-content-center align-items-center'>
         {
            isMainMenu ?
               <MainMenu/> :
               <Board />
         }
      </div>
   )
}

export default Game
