import React, { useContext, useState, useEffect } from 'react'
import AppContext, {TimeRecord} from './context/AppContext'
import BoardView from './board-view/BoardView'
import MainMenu from './main-menu/MainMenu'
import db, { sortRecords } from '../firebase/firebase'
import { EASY, MEDIUM, EXPERT } from '../constants/constants'

import './game.css'

const Game = () => {

   const {
      isMainMenu,
      setEasyTimeRecords,
      setMediumTimeRecords,
      setExpertTimeRecords
   } = useContext(AppContext);

   
   setEasyTimeRecords(useCollectionHook(EASY));
   setMediumTimeRecords(useCollectionHook(MEDIUM));
   setExpertTimeRecords(useCollectionHook(EXPERT));


   /**
    * Custom Hook. Sets a 
    */
   function useCollectionHook(collection: string) {
      const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
      useEffect(() => {
         let records: TimeRecord[] = [];
         db.collection(collection).onSnapshot(snapshot => {
            records = snapshot.docs.map(doc => {
               const record: TimeRecord = {
                  name: doc.data().name,
                  seconds: doc.data().seconds,
                  minutes: doc.data().minutes,
                  date: doc.data().date
               }
               return record;
            })
            setTimeRecords(sortRecords(records));
         });
      }, [collection])
      return timeRecords;
   }


   


   function isNewRecord(records: TimeRecord[], newRecord: TimeRecord) : boolean {
      const recs = records.concat(newRecord);
      const sortedRecords = sortRecords(recs);
      for (let i = 0; i < sortedRecords.length; i++) {
         if (newRecord.date === sortedRecords[i].date && i > 9) {
            return false;
         }
      }
      return true;
   }


   return (
      <div className='game-container d-flex justify-content-center align-items-center'>
         {
            isMainMenu ?
               <MainMenu sortRecords={sortRecords}/> :
               <BoardView sortRecords={sortRecords} isNewRecord={isNewRecord}/>
         }
      </div>
   )
}

export default Game
