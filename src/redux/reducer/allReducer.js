import {combineReducers} from 'redux';
import {loginReducer} from '../../screens/Login/Redux/reducer';
import {dashReducer} from '../../screens/Dasboard/Redux/reducer';

export const allReducer = combineReducers({
  login: loginReducer,
  dash: dashReducer,
});
