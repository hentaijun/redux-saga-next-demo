import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createSagaMiddleware from 'redux-saga';
import reducer from './model/reducer';
import mainSaga from './model/sagas';

const sagaMiddleware = createSagaMiddleware();
export const initStore = (initialState) => {
  const store = createStore(reducer, initialState, applyMiddleware(sagaMiddleware,thunkMiddleware));
  sagaMiddleware.run(mainSaga);
  return store
}