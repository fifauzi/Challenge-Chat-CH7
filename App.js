import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router from './src/Router';
import messaging from '@react-native-firebase/messaging';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistedStore, store} from './src/redux/store/store';

const App = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
    });
    return unsubscribe;
  }, []);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistedStore}>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
