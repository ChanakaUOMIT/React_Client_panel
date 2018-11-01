import { createStore, combineReducers, compose } from 'redux';
import firebase from 'firebase';
import 'firebase/firestore';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
//Reducers
//@todo
import notifyReducer from './reducers/notifyReducer';
import settingsReducer from './reducers/settingsReducer';

const firebaseConfig ={
    apiKey: "AIzaSyD9KCT1mvaiALM884iy41iezGE1f2m3S6s",
    authDomain: "rclientpanel.firebaseapp.com",
    databaseURL: "https://rclientpanel.firebaseio.com",
    projectId: "rclientpanel",
    storageBucket: "rclientpanel.appspot.com",
    messagingSenderId: "687401596734"
};

// react-redux-firebase config
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
  }

  // Initialize firebase instance
firebase.initializeApp(firebaseConfig);
//Initialize firestore
const firestore=firebase.firestore();
const settings = {timestampsInSnapshots: true};
  firestore.settings(settings);


// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
    reduxFirestore(firebase) // <- needed if using firestore
  )(createStore);

  // Add firebase to reducers
const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer, // <- needed if using firestore
    notify:notifyReducer,
    settings: settingsReducer,
  });

//Check for settings in Local Storage
if(localStorage.getItem('settings')==null){
  //Default settings
  const defaultSettings={
    disableBalanceOnAdd: true, 
    disableBalanceOnEdit: false,
    allowRegistration: false
  }

  //Set to LocalStorage
  localStorage.setItem('settings', JSON.stringify(defaultSettings))
}

// Create store with reducers and initial state
const initialState = {settings: JSON.parse(localStorage.getItem('settings'))};

//Create Store
const store = createStoreWithFirebase(rootReducer, initialState, compose(
    reactReduxFirebase(firebase),
    //window.__REDUX_DEVTOOLS_EXTENTION__ && window.__REDUX_DEVTOOLS_EXTENTION__()
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)) ;

export default store;
