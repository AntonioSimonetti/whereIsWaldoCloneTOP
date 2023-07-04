import { signInWithGoogle } from "../firebase";

function Alternate({ onStart, gameStarted }) {
  const isSignedIn = localStorage.getItem("name");

  return (
    <div className="gameControlDiv">
      {!gameStarted && (
        <button className="startGame" onClick={onStart}>
          START!
        </button>
      )}
      {!isSignedIn && !gameStarted && (
        <button onClick={signInWithGoogle} className="googleSignIn">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google Logo"
            className="googleLogo"
          />
          <p className="textSingIn">Sign in with Google</p>
        </button>
      )}
    </div>
  );
}

export default Alternate;
