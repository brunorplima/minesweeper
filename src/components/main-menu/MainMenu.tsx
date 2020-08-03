import React, { useContext } from 'react'
import AppContext from './../context/AppContext'
import Level from './Level'

import './main-menu.css'

interface Props {
   
}

const MainMenu: React.FC<Props> = props => {

   const {
      setMines
   } = useContext(AppContext);


   const levels = ['Easy', 'Medium', 'Expert']

   return (
      <div className='main-menu-container'>
         <div className='game-name'>
            <div>Bruno's</div>
            <h1>Minesweeper</h1>
         </div>

         <div className='difficulty'>
            {
               levels.map(lvl => <Level key={lvl} level={lvl} setMines={setMines} />)
            }
         </div>
         <div>Developed By <a href='https://brunoreactdeveloper.web.app/' target='_blank' rel='noopener noreferrer'>Bruno Lima</a></div>
      </div>
   )
}

export default MainMenu
