import React from 'react'
import { GrFormClose } from 'react-icons/gr'


interface Props {
   setOpenHelp: Function
}

const HelpWindow : React.FC<Props> = props => {


   return (
      <div className='help-window'>
         <div className='close-window' onClick={e => props.setOpenHelp(false)}>
            <GrFormClose style={{color:'white'}}/>
         </div>
         <div className='hw-mobile'>
            <div>Mobile:</div>
            <div> - Touch to open a square</div>
            <div> - Touch and hold to flag a square</div>
         </div>
         <div className='hw-desktop'>
            <div>Desktop:</div>
            <div> - Left-click to open a square</div>
            <div> - Right-click to flag a square</div>
         </div>
         <div>Goal: Open all squares without opening a square with a bomb in it. Once all non-bomb squares are opened you win the game. Open a square with a bomb in it and you lose the game.</div>
         <div>The numbered squares mean there is/are that many bomb/bombs within the 8 squares around them.</div>
         <div>Use the flags to warn yourself that you found out that a given square has a bomb in it.</div>
         <div>Have fun!</div>
      </div>
   )
}

export default HelpWindow
