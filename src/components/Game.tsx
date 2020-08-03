import React, { useContext } from 'react'
import AppContext from './context/AppContext'
import BoardView from './board-view/BoardView'
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
               <BoardView />
         }
      </div>
   )
}

export default Game
