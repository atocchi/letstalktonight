import * as firebase from 'firebase';
import config from './config.js';

firebase.initializeApp(config);

const db = firebase.database();

export default db;
