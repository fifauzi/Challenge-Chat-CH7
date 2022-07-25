import {firebase} from '@react-native-firebase/database';

export const myDb = firebase
  .app()
  .database(
    'https://mychat-38cfa-default-rtdb.asia-southeast1.firebasedatabase.app/',
  );
