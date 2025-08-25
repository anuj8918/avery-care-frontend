// src/redux/sagas/index.js

import { all } from 'redux-saga/effects';
import authSaga from './authSaga';
import familySaga from './familySaga'; //  ADD THIS
import usersSaga from './userSaga'
import adminAuthSaga from './adminSaga';
import { watchCallSagas } from "./callSaga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    familySaga(), //  ADD THIS
    watchCallSagas(),
    usersSaga() ,
    adminAuthSaga(),// ✅ ADD THIS
  ]);
}
