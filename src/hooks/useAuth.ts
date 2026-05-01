import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { auth, db, storage } from "../firebase";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setUserData({ id: user.uid, ...snap.data() });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signup = async (email: string, password: string, profile: any) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const userDoc = {
      email,
      firstName: profile.firstName,
      age: profile.age,
      gender: profile.gender || "",
      bio: profile.bio || "",
      passions: profile.passions || [],
      occupation: profile.occupation || "",
      lookingFor: profile.lookingFor || "",
      photos: [],
      voiceUrl: "",
      isPremium: false,
      createdAt: Date.now(),
    };
    await setDoc(doc(db, "users", cred.user.uid), userDoc);
    setUserData({ id: cred.user.uid, ...userDoc });
    return cred.user;
  };

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    if (snap.exists()) {
      setUserData({ id: cred.user.uid, ...snap.data() });
    }
    return cred.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  const updateProfile = async (data: any) => {
    if (!firebaseUser) return;
    await setDoc(doc(db, "users", firebaseUser.uid), data, { merge: true });
    setUserData((prev: any) => ({ ...prev, ...data }));
  };

  const uploadPhoto = async (file: File, index: number): Promise<string> => {
    if (!firebaseUser) throw new Error("Non connecté");
    const storageRef = ref(storage, `users/${firebaseUser.uid}/photo_${index}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    const currentPhotos: string[] = [...(userData?.photos || [])];
    while (currentPhotos.length <= index) currentPhotos.push("");
    currentPhotos[index] = url;
    await updateProfile({ photos: currentPhotos });
    return url;
  };

  const deletePhoto = async (index: number): Promise<void> => {
    if (!firebaseUser) return;
    try {
      const storageRef = ref(storage, `users/${firebaseUser.uid}/photo_${index}`);
      await deleteObject(storageRef);
    } catch {}
    const currentPhotos: string[] = [...(userData?.photos || [])];
    currentPhotos[index] = "";
    await updateProfile({ photos: currentPhotos });
  };

  return { firebaseUser, userData, loading, signup, login, logout, updateProfile, uploadPhoto, deletePhoto };
}