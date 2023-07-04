import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjtd6uGwerMXr2euV2dqla21beIHErLyg",
  authDomain: "whereiswaldo-fa00e.firebaseapp.com",
  projectId: "whereiswaldo-fa00e",
  storageBucket: "whereiswaldo-fa00e.appspot.com",
  messagingSenderId: "1076524178861",
  appId: "1:1076524178861:web:2a89094407078455221524",
  measurementId: "G-MV70LTXPNF",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

// Goolge auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const signInWithGoogle = () => {
  provider.setCustomParameters({
    prompt: "select_account",
  });
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
      const name = result.user.displayName;
      const email = result.user.email;
      const profilePic = result.user.photoURL;

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("profilePic", profilePic);
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
};

const handleLogout = () => {
  // Clear user data from localStorage
  localStorage.clear();
  window.location.reload();
};

// Fetch coordinates from the "coordinates" collection
const fetchCoordinates = async () => {
  try {
    const coordinatesRef = firestore.collection("coordinates");
    const coordinatesSnapshot = await coordinatesRef.get();
    const coordinates = coordinatesSnapshot.docs.map((doc) => doc.data());
    //console.log("Coordinates:", coordinates);
    return coordinates;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
};

// Fetch leaderboard data from the "leaderboard" collection
const fetchLeaderboard = async () => {
  try {
    const leaderboardRef = firestore.collection("leaderboard");
    const leaderboardSnapshot = await leaderboardRef.get();
    const leaderboardData = leaderboardSnapshot.docs.map((doc) => doc.data());
    return leaderboardData;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw error;
  }
};

// Add player data to the "leaderboard" collection
const addPlayerToLeaderboard = async (playerName, elapsedTime) => {
  try {
    const leaderboardRef = firestore.collection("leaderboard");
    await leaderboardRef.add({
      name: playerName,
      time: elapsedTime,
    });
  } catch (error) {
    console.error("Error adding player to leaderboard:", error);
    throw error;
  }
};

export {
  firebase,
  firestore,
  auth,
  signInWithGoogle,
  handleLogout,
  fetchCoordinates,
  fetchLeaderboard,
  addPlayerToLeaderboard,
};
