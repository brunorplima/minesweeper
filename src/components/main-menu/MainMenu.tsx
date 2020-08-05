import React, { useContext, useState, useEffect } from 'react'
import AppContext, { TimeRecord } from './../context/AppContext'
import Level from './Level'
import { GiTrophy } from 'react-icons/gi'
import { RiCloseLine } from 'react-icons/ri'
import db from '../../firebase/firebase'
import { EASY } from '../../constants/constants'

import './main-menu.css'

interface Props {
   
}

const MainMenu: React.FC<Props> = props => {

   const {
      setMines,
      easyTimeRecords,
      setEasyTimeRecords
   } = useContext(AppContext);

   const [isRecordsOpen, setIsRecordsOpen] = useState(false);
   const [recordsClicked, setRecordsClicked] = useState(false);
   const [loading, setLoading] = useState(true);

   setEasyTimeRecords(useEasyCollectionHook())





   // useEffect(() => {
   //    db.collection(EASY).add({
   //       name: 'Ludmila',
   //       minutes: 4,
   //       seconds: 19,
   //       date: Date.now()
   //    })
      
   // }, []);





   function useEasyCollectionHook() {
      const [easyRecords, setEasyRecords] = useState<TimeRecord[]>([]);

      useEffect(() => {
         async function fetchData() {
            try {
               if (isRecordsOpen && easyTimeRecords.length === 0) {
                  let records: TimeRecord[] = [];

                  await db.collection(EASY).get().then(snapshot => {
                     records = snapshot.docs.map((doc, i) => {
                        const record: TimeRecord = {
                           name: doc.data().name,
                           second: doc.data().seconds,
                           minute: doc.data().minutes,
                           date: doc.data().date
                        }
                        return record;
                     });
                  })
                  setEasyRecords(sortRecords(records).filter((rec, i) => i < 10));
               }
            }
            catch(error) {
               console.error('FIREBASE DB ERROR:', error.message);
            }
         }

         if (!easyRecords.length) fetchData();
      }, [easyRecords, isRecordsOpen, easyTimeRecords.length]);

      return easyRecords;
   }





   function getTime(min: number, sec: number) {
      let minutes = min < 10 ? `0${min}`: min;
      let seconds = sec < 10 ? `0${sec}`: sec;
      return `${minutes}:${seconds}`;
   }


   function sortRecords(records: TimeRecord[]) : TimeRecord[] {
      const firstSort = records.sort((a, b) => a.minute - b.minute)
      const secondSort: Array<Array<TimeRecord>> = [];
      const finalSort: TimeRecord[] = [];
      let arrCount = -1;
      for (let i = 0; i < firstSort.length; i++) {
         if (!i || firstSort[i].minute !== firstSort[i - 1].minute) {
            secondSort.push([]);
            arrCount++;
         }
         secondSort[arrCount].push(firstSort[i]);
      }
      secondSort.forEach(rec => {
         const recs = rec.sort((a, b) => a.second - b.second)
         finalSort.push(...recs);
      });
      return finalSort;
   }



   function getRemainingPositions() {
      const until = easyTimeRecords.length;
      if (until < 10) {
         const remaining = [];
         for (let pos = until + 1; pos <= 10; pos++) {
            remaining.push(
               <div key={pos} className='p-record d-flex'>
                  <div className='record-position' style={{color: getPositionColor(pos)}}>
                     {
                        pos <= 2 ?
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


   const levels = ['Easy', 'Medium', 'Expert']

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
               <span>In development</span>
               <div className='positions'>
                  {
                     easyTimeRecords.map((record, i) => {
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
                                    record.name.substring(0, 15) + '...' :
                                    record.name
                                 }
                              </div>
                              <div className='record-time'>
                                 {getTime(record.minute, record.second)}
                              </div>
                              {/* <div className='record-date d-flex justify-content-center align-items-end'>
                                 {`${record.date.getMonth()}-${record.date.getFullYear()}`}
                              </div> */}
                           </div >
                        )
                     })
                  }
                  {
                     easyTimeRecords.length ? getRemainingPositions() : null
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
