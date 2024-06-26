import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "../../assets/googleIcon.svg";

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Check for user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  };
  return (
    <div>
      <button onClick={onGoogleClick} className="btn-sign p-2">
        Sign {location.pathname === "/SignUp" ? "up" : "in"} with{" "}
        <img
          style={{ width: "1rem", height: "1rem" }}
          src={googleIcon}
          alt="google"
        />
      </button>
    </div>
  );
}

export default OAuth;
