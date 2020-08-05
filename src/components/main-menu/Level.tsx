import React, { useContext } from 'react'
import AppContext from '../context/AppContext'
import { FaBomb } from 'react-icons/fa'
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
      setIsMainMenu
   } = useContext(AppContext);

   function clickHandler() {
      switch (props.level) {
         case 'Easy':
            props.setMines(20);
            setIsMainMenu(false);
            break;
         case 'Medium':
            props.setMines(30);
            setIsMainMenu(false);
            break;
         case 'Expert':
            props.setMines(40);
            setIsMainMenu(false);
            break;
      }
   }


   let bgColor = '#D0359A', minesNumber = 0, image = '';

   switch (props.level) {
      case 'Easy':
         bgColor = '#59a843';
         minesNumber = 20;
         image = `url(${mountain})`;
         break;
      case 'Medium':
         bgColor = '#EAAD14';
         minesNumber = 30;
         image = `url(${paradise})`;
         break;
      case 'Expert':
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
