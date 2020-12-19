import firebase from 'firebase'
import { TimeRecord } from '../components/context/AppContext'

const firebaseConfig = {
   apiKey: process.env.REACT_APP_API_KEY,
   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
   databaseURL: process.env.REACT_APP_DATABASE_URL,
   projectId: 'brunosminesweeper',
   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
   appId: process.env.REACT_APP_APP_ID,
   measurementId: process.env.REACT_APP_MEASUREMENT_ID
}

firebase.initializeApp(firebaseConfig);
// firebase.analytics(app);


// Creates a reference of the database
const db = firebase.firestore();

export default db;

console.log(process.env.API_KEY);
export const analytics = firebase.analytics();
analytics.logEvent(firebase.analytics.EventName.PAGE_VIEW, {key:'ms',page_title:'Brunos minesweeper',page_location:'/',page_path:'/'});

export function createTimeRecord(name: string, seconds: number, minutes: number, date: number) : TimeRecord {
   return {
      name,
      seconds,
      minutes,
      date
   }
}


export async function addToDatabase(collection: string, data: TimeRecord) {
   try {
      await db.collection(collection).doc(String(data.date)).set(data);
      removeRecordOff(collection);
   }
   catch(err) {
      console.log('ERROR:', err.message);
   }
}

async function removeRecordOff(collection: string) {
   let records: TimeRecord[] = [];
   await db.collection(collection).get().then(value => {
      records.push(...value.docs.map(value => {
         return createTimeRecord(
            value.data().name, 
            value.data().seconds, 
            value.data().minutes,
            value.data().date)
      }));
   })
   records = sortRecords(records);
   if (records.length > 10) {
      records.forEach((val, i) => {
         if (i > 9) db.collection(collection).doc(String(val.date)).delete();
      })
   }
}


export function sortRecords(records: TimeRecord[]) : TimeRecord[] {
   const firstSort = records.sort((a, b) => a.minutes - b.minutes)
   const secondSort: Array<Array<TimeRecord>> = [];
   const finalSort: TimeRecord[] = [];
   let arrCount = -1;
   for (let i = 0; i < firstSort.length; i++) {
      if (!i || firstSort[i].minutes !== firstSort[i - 1].minutes) {
         secondSort.push([]);
         arrCount++;
      }
      secondSort[arrCount].push(firstSort[i]);
   }
   secondSort.forEach(rec => {
      const recs = rec.sort((a, b) => a.seconds - b.seconds)
      finalSort.push(...recs);
   });
   return finalSort;
}