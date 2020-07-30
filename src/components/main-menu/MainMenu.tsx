import React, { useEffect, useState, useContext } from 'react'
import AppContext from './../context/AppContext'
import Level from './Level'

import './main-menu.css'

interface Props {
   
}

const MainMenu: React.FC<Props> = props => {

   const {
      setMines
      
   } = useContext(AppContext);



   const screenSize = useWindowSize();



   useEffect(() => {
   }, []);



   function useWindowSize() {
      interface WindowSize {
         width: number | undefined,
         height: number | undefined
      }
      const [windowSize, setWindowSize] = useState<WindowSize>({
         width: undefined,
         height: undefined
      })

      useEffect(() => {
         const handleResize = () => {
            setWindowSize({
               width: window.innerWidth,
               height: window.innerHeight
            })
         }

         window.addEventListener('resize', handleResize);

         if (!windowSize.width || !windowSize.height) handleResize();

         return () => window.removeEventListener('resize', handleResize);
      }, []);

      return windowSize;
   }




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
      </div>
   )
}

export default MainMenu
