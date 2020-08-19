import React, { useContext, useState, SyntheticEvent } from 'react'
import AppContext from '../context/AppContext'
import { WON } from '../../constants/constants'

interface Props {
   getTime: Function,
   handleNameChange: Function,
   handleOnClick: Function,
   setNewGame: Function,
   goToMainMenu: Function,
   isRecord: boolean,
   getPosition: Function
}

const GameOverWindow : React.FC<Props> = props => {

   const { isGameOver } = useContext(AppContext);

   const [hideForm, setHideForm] = useState(false)

   function getPositionString() {
      switch(props.getPosition()) {
         case 1:
            return '1st'
         case 2:
            return '2nd'
         case 3:
            return '3rd'
         default:
            return props.getPosition() + 'th'
      }
   }


   function onSubmit(e: SyntheticEvent) {
      e.preventDefault();
      props.handleOnClick(e);
      setHideForm(true);
   }


   return (
      <div className='game-over-window'>
         <div>{isGameOver.status === WON ? 'Congratulation, you WON!' : 'Game Over!'}</div>
         <div>Time: {props.getTime()}</div>

         {
            props.isRecord && isGameOver.status === WON && !hideForm ?
            <form>
               <div>You did very well!</div>
               <div>You got yourself at the {getPositionString()} best time</div>
               <div className='d-flex flex-column align-items-center'>
                  <input type='text' onChange={e => props.handleNameChange(e)} placeholder='Name'/>
                  <input type='submit' onClick={e => onSubmit(e)} value='Submit'/>
               </div>
            </form> :
            isGameOver.status === WON && !hideForm &&
            <div>
               <div>Added to top time list</div>
            </div>
         }

         <div className='game-over-options'>
            <button 
               className='btn btn-primary'
               onClick={e => props.setNewGame(e)}
            >
               New Game
            </button>

            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            <button 
               className='btn btn-light'
               onClick={e => props.goToMainMenu(e)}
            >
               Main Menu
            </button>
         </div>
      </div>
   )
}

export default GameOverWindow
