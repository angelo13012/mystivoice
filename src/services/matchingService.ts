import {
  collection, doc, setDoc, getDoc, getDocs,
  query, where, orderBy, onSnapshot, serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

export async function likeUser(fromUid: string, toUid: string): Promise<boolean> {
  await setDoc(doc(db, "likes", `${fromUid}_${toUid}`), {
    from: fromUid, to: toUid, createdAt: serverTimestamp(),
  });
  const reverse = await getDoc(doc(db, "likes", `${toUid}_${fromUid}`));
  if (reverse.exists()) {
    const matchId = [fromUid, toUid].sort().join("_");
    await setDoc(doc(db, "matches", matchId), {
      users: [fromUid, toUid], createdAt: serverTimestamp(),
      lastMessage: "", lastMessageAt: serverTimestamp(),
    });
    return true;
  }
  return false;
}

export async function passUser(fromUid: string, toUid: string): Promise<void> {
  await setDoc(doc(db, "passes", `${fromUid}_${toUid}`), {
    from: fromUid, to: toUid, createdAt: serverTimestamp(),
  });
}

export async function getProfilesToDiscover(currentUid: string): Promise<any[]> {
  const [likesSnap, passesSnap] = await Promise.all([
    getDocs(query(collection(db, "likes"), where("from", "==", currentUid))),
    getDocs(query(collection(db, "passes"), where("from", "==", currentUid))),
  ]);
  const seen = new Set<string>();
  likesSnap.forEach(d => seen.add(d.data().to));
  passesSnap.forEach(d => seen.add(d.data().to));
  seen.add(currentUid);
  const usersSnap = await getDocs(collection(db, "users"));
  const profiles: any[] = [];
  usersSnap.forEach(d => { if (!seen.has(d.id)) profiles.push({ id: d.id, ...d.data() }); });
  return profiles;
}

export function listenMatches(uid: string, callback: (matches: any[]) => void) {
  const q = query(collection(db, "matches"), where("users", "array-contains", uid));
  return onSnapshot(q, async (snap) => {
    const matches = await Promise.all(snap.docs.map(async (d) => {
      const data = d.data();
      const otherUid = data.users.find((u: string) => u !== uid);
      const profSnap = await getDoc(doc(db, "users", otherUid));
      const prof = profSnap.exists() ? { id: otherUid, ...profSnap.data() } : null;
      const msgsSnap = await getDocs(
        query(collection(db, "matches", d.id, "messages"), orderBy("createdAt", "asc"))
      );
      const msgs = msgsSnap.docs.map(m => ({ id: m.id, ...m.data() }));
      return { id: d.id, prof, mc: msgs.length, msgs };
    }));
    callback(matches.filter(m => m.prof !== null));
  });
}

export async function sendMessage(matchId: string, senderUid: string, text: string): Promise<void> {
  const msgRef = doc(collection(db, "matches", matchId, "messages"));
  await setDoc(msgRef, { sid: senderUid, text, type: "text", createdAt: serverTimestamp() });
  await setDoc(doc(db, "matches", matchId), { lastMessage: text, lastMessageAt: serverTimestamp() }, { merge: true });
}

export async function sendVoiceMessage(matchId: string, senderUid: string, blob: Blob): Promise<void> {
  const filename = `voice_${Date.now()}.webm`;
  const storageRef = ref(storage, `voices/${matchId}/${filename}`);
  await uploadBytes(storageRef, blob, { contentType: "audio/webm" });
  const url = await getDownloadURL(storageRef);
  const msgRef = doc(collection(db, "matches", matchId, "messages"));
  await setDoc(msgRef, { sid: senderUid, voiceUrl: url, type: "voice", duration: 0, createdAt: serverTimestamp() });
  await setDoc(doc(db, "matches", matchId), { lastMessage: "🎤 Message vocal", lastMessageAt: serverTimestamp() }, { merge: true });
}

export function listenMessages(matchId: string, callback: (msgs: any[]) => void) {
  const q = query(collection(db, "matches", matchId, "messages"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}