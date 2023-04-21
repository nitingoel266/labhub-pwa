// import { useEffect, useState } from 'react';
// import { BehaviorSubject } from 'rxjs';
// import { NavStatus, NavStatusUpdate } from '../types/client';

// export const navStatus = new BehaviorSubject<NavStatus>({
//   modeSelected: null,
//   funcSelected: null,
// });
// export const navStatusUpdate = new BehaviorSubject<NavStatusUpdate | null>(null);

// export const useNavStatus = () => {
//   const [status, setStatus] = useState(navStatus.value);

//   useEffect(() => {
//     const subs = navStatus.subscribe(value => setStatus(value));
//     return () => subs.unsubscribe();
//   }, []);

//   return [status];
// };

export {};
