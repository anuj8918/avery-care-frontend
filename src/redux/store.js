// src/redux/store.js

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "./authSlice";
import familyReducer from "./familySlice"; // ADD THIS
import rootSaga from "./sagas";
import callReducer from "./callSlice"; // Assuming you have a callSlice
import userReducer from './userSlice'
// import rootSaga from './sagas';
import adminAuthReducer from './adminSlice'

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "adminAuth"], // Only persist auth and adminAuth slices
};

const rootReducer = combineReducers({
  auth: authReducer,
  family: familyReducer, //  ADD THIS
  call:callReducer, // Assuming you have a callReducer
  adminAuth:adminAuthReducer,
 users:userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);