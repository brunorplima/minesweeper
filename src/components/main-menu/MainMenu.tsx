import React, { useContext, useState } from 'react'
import AppContext from './../context/AppContext'
import Level from './Level'
import { GiTrophy } from 'react-icons/gi'
import { RiCloseLine } from 'react-icons/ri'
import { EASY, MEDIUM, EXPERT } from '../../constants/constants'

import './main-menu.css'

interface Props {
   sortRecords: Function
}

const MainMenu: React.FC<Props> = props => {

   const {
      setMines,
      easyTimeRecords,
      mediumTimeRecords,
      expertTimeRecords
   } = useContext(AppContext);

   const [isRecordsOpen, setIsRecordsOpen] = useState(false);
   const [recordsClicked, setRecordsClicked] = useState(false);
   const [diffLevel, setDiffLevel] = useState(EASY);


   function getSelectedCollection() {
      switch(diffLevel) {
         case EASY:
            return easyTimeRecords;
         case MEDIUM:
            return mediumTimeRecords;
         default:
            return expertTimeRecords;
      }
   }



   function getTime(min: number, sec: number) {
      let minutes = min < 10 ? `0${min}`: min;
      let seconds = sec < 10 ? `0${sec}`: sec;
      return `${minutes}:${seconds}`;
   }



   function getRemainingPositions() {
      const until = getSelectedCollection().length;
      if (until < 10) {
         const remaining = [];
         for (let pos = until + 1; pos <= 10; pos++) {
            remaining.push(
               <div key={pos} className='p-record d-flex'>
                  <div className='record-position' style={{color: getPositionColor(pos)}}>
                     {
                        pos <= 3 ?
                           <GiTrophy /> :
                           pos
                     }
                  </div>
                  <div className='record-user-name'>
                     --
                  </div>
                  <div className='record-time'>
                     --
                  </div>
               </div >
            )
         }
         return remaining;
      }
      return null;
   }


   function getPositionColor(position: number) : string {
      switch(position) {
         case 1:
            return '#FFD700';
         case 2: 
            return '#C0C0C0';
         case 3:
            return '#CD7F32';
         default:
            return 'white';
      }
   }

   function openCloseRecords() {
      if (!recordsClicked) setRecordsClicked(true);
      setIsRecordsOpen(!isRecordsOpen);
   }


   const levels = [EASY, MEDIUM, EXPERT]

   return (
      <div className='main-menu-container'>
         <div className='game-name'>
            <div>Bruno's</div>
            <h1>Minesweeper</h1>
         </div>

         {
            isRecordsOpen &&
            <div className='records-container'>
               <div className='close-records' onClick={() => openCloseRecords()}>
                  <RiCloseLine style={{color: 'white'}} />
               </div>

               <h2>Records</h2>
               <div className='d-flex'>
                  <div className={diffLevel === EASY ? 'tab easy-tab p-1 selected-tab' : 'tab easy-tab p-1'} onClick={() => setDiffLevel(EASY)}>Easy</div>
                  <div className={diffLevel === MEDIUM ? 'tab medium-tab p-1 selected-tab' : 'tab medium-tab p-1'} onClick={() => setDiffLevel(MEDIUM)}>Medium</div>
                  <div className={diffLevel === EXPERT ? 'tab expert-tab p-1 selected-tab' : 'tab expert-tab p-1'} onClick={() => setDiffLevel(EXPERT)}>Expert</div>
               </div>
               <div className='positions'>
                  {
                     getSelectedCollection().map((record, i) => {
                        return (
                           <div key={i} className='p-record d-flex'>
                              <div className='record-position' style={{color: getPositionColor(i + 1)}}>
                                 {
                                    i <= 2 ?
                                       <GiTrophy /> :
                                       i + 1
                                 }
                              </div>
                              <div className='record-user-name'>
                                 {
                                    record.name.length > 15 ?
                                    record.name.substring(0, 18) + '...' :
                                    record.name
                                 }
                              </div>
                              <div className='record-time'>
                                 {getTime(record.minutes, record.seconds)}
                              </div>
                              {/* <div className='record-date d-flex justify-content-center align-items-end'>
                                 {`${record.date.getMonth()}-${record.date.getFullYear()}`}
                              </div> */}
                           </div >
                        )
                     })
                  }
                  {
                     getRemainingPositions()
                  }
               </div>
            </div>
         }

         {
            !isRecordsOpen &&
            <div className='difficulty'>
               {
                  levels.map(lvl => {
                     return (
                        <div key={lvl} className='level'>
                           <Level level={lvl} setMines={setMines} />
                        </div>
                     )
                  })
               }

               <div 
                  className='records-button d-flex justify-content-center align-items-center'
                  onClick={() => openCloseRecords()}   
               >
                  <GiTrophy />
               </div>
            </div>
         }
         <div>Developed By <a href='https://brunoreactdeveloper.web.app/' target='_blank' rel='noopener noreferrer'>Bruno Lima</a></div>
      </div>
   )
}

export default MainMenu
