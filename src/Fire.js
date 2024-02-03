import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  get,
  update,
  remove,
  onValue,
  query,
} from "firebase/database";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";

class Fire {
  constructor() {
    // Initialize Firebase with your config
    const firebaseConfig = {
      apiKey: "AIzaSyAKfSqnFESmoyi7uh6139wDYZioBB20ANg",
      authDomain: "django-2546a.firebaseapp.com",
      databaseURL: "https://django-2546a-default-rtdb.firebaseio.com",
      projectId: "django-2546a",
      storageBucket: "django-2546a.appspot.com",
      messagingSenderId: "507483439501",
      appId: "1:507483439501:web:40104306f954f53490bdc4",
      measurementId: "G-TE8316F38Y"
    };

    const app = initializeApp(firebaseConfig);
    this.database = getDatabase(app);
    this.googleProvider = new GoogleAuthProvider();
    this.auth = getAuth(app);
  }


  async logout() {
    await signOut(this.auth);
  }

  getuser() {
    return this.auth;
  } 

  async loginWithEmailPassword(email, password) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      const user = result.user;
      console.log("User logged in successfully:", user);
      return user;
    } catch (error) {
      console.error("Error logging in with email and password:", error);
      throw error;
    }
  }
  
  async createData(path, data) {
    try {
      const newDataRef = push(ref(this.database, path), data);
      return newDataRef.key;
    } catch (error) {
      console.error("Error adding data: ", error);
      throw error;
    }
  }

  async getData(path) {
    try {
      const dataSnapshot = await get(ref(this.database, path));
      return dataSnapshot.val();
    } catch (error) {
      console.error("Error getting data: ", error);
      throw error;
    }
  }

  async updateData(path, newData) {
    try {
      await update(ref(this.database, path), newData);
      console.log("Data successfully updated!");
    } catch (error) {
      console.error("Error updating data: ", error);
      throw error;
    }
  }

  async deleteData(path) {
    try {
      await remove(ref(this.database, path));
      console.log("Data successfully deleted!");
    } catch (error) {
      console.error("Error deleting data: ", error);
      throw error;
    }
  }

  listenForChanges(path, callback) {
    try {
      const dataRef = ref(this.database, path);
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
      });
    } catch (error) {
      console.error("Error listening for changes: ", error);
      throw error;
    }
  }
}

export default Fire;
