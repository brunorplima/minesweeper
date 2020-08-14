import React, { useContext } from 'react'
import AppContext from '../context/AppContext'
import { FaBomb } from 'react-icons/fa'
import { EASY, MEDIUM, EXPERT } from '../../constants/constants'
import mountain from '../../images/mountain.jpg'
import paradise from '../../images/paradise.jpg'
import sunset from '../../images/sunset.jpg'

import './level.css'

interface Props {
   level: string,
   setMines: Function
}

const Level : React.FC<Props> = props => {

   const {
      setIsMainMenu,
      setLevel
   } = useContext(AppContext);

   function clickHandler() {
      switch (props.level) {
         case EASY:
            props.setMines(20);
            setIsMainMenu(false);
            setLevel(EASY);
            break;
         case MEDIUM:
            props.setMines(30);
            setIsMainMenu(false);
            setLevel(MEDIUM);
            break;
         case EXPERT:
            props.setMines(40);
            setIsMainMenu(false);
            setLevel(EXPERT);
            break;
      }
   }


   let bgColor = '#D0359A', minesNumber = 0, image = '';

   switch (props.level) {
      case EASY:
         bgColor = '#59a843';
         minesNumber = 20;
         image = `url(${mountain})`;
         break;
      case MEDIUM:
         bgColor = '#EAAD14';
         minesNumber = 30;
         image = `url(${paradise})`;
         break;
      case EXPERT:
         bgColor = '#e05d16';
         minesNumber = 40;
         image = `url(${sunset})`;
         break;
   }

   return (
      <div 
         className='level-container d-flex flex-column' 
         style={props.level === 'Custom' ? {marginBottom: 0} : {}}
         onClick={clickHandler}
      >
         <div 
            className='level-img'
            style={props.level === 'Medium' ? {backgroundImage: image, backgroundPosition: 'top'} : {backgroundImage: image}}
         >
            {/* <img src={image} alt='Level picture' /> */}
         </div>

         <div className='level-description d-flex justify-content-between' style={{backgroundColor: bgColor}}>
            {props.level}
            {
               minesNumber ?
               <div className='d-flex align-items-center'>
                  <FaBomb />
                  &nbsp;
                  {minesNumber}
               </div> :
               null
            }
         </div>
      </div>
   )
}

export default Level
