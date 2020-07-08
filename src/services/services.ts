import SquareLocations, { SquareLocation } from '../components/AppContext';


export const iswithinLocationList = (searchLocation: SquareLocation | SquareLocation[], mineLocations: SquareLocation[]): boolean | boolean[] => {
   let found = false;
   if (Array.isArray(searchLocation)) {
      return searchLocation.map(loc => {
         for (let i = 0; i < mineLocations.length; i++) {
            if (JSON.stringify(mineLocations[i]) === JSON.stringify(loc)) {
               found = true;
               break;
            }
         }
         return found;
      });
   } else {
      for (let i = 0; i < mineLocations.length; i++) {
         if (JSON.stringify(mineLocations[i]) === JSON.stringify(searchLocation)) {
            found = true;
            break;
         }
      }
      return found;
   }
}

