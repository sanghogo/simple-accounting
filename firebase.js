// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 여기 부분은 너의 Firebase 설정 복사해서 붙여넣기
const firebaseConfig = {
  apiKey: "너의-API-KEY",
  authDomain: "너의-프로젝트-ID.firebaseapp.com",
  projectId: "너의-프로젝트-ID",
  storageBucket: "너의-프로젝트-ID.appspot.com",
  messagingSenderId: "메시지-ID",
  appId: "앱-ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
