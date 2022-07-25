import {createStore, applyMiddleware} from 'redux';
import {allReducer} from '../reducer/allReducer';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'persisted',
  storage: AsyncStorage,
};

const allMiddlewares = applyMiddleware(thunk);
const persistedReducer = persistReducer(persistConfig, allReducer);

export const store = createStore(persistedReducer, {}, allMiddlewares);

export const persistedStore = persistStore(store);
