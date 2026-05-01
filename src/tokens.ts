export const T = {
  bg: "#0A0A0F",
  bgCard: "#13131A",
  bgEl: "#1A1A24",
  bgGlass: "rgba(19,19,26,0.85)",
  ac: "#8B5CF6",
  acL: "#A78BFA",
  acD: "#6D28D9",
  acGlow: "rgba(139,92,246,0.25)",
  gold: "#F59E0B",
  goldGlow: "rgba(245,158,11,0.2)",
  rose: "#F43F5E",
  emerald: "#10B981",
  tx: "#F8FAFC",
  txM: "#94A3B8",
  txD: "#475569",
  bd: "rgba(148,163,184,0.08)",
  bdL: "rgba(148,163,184,0.15)",
};

export const PASSIONS = [
  "Musique", "Danse", "Cinéma", "Sport", "Cuisine", "Voyage",
  "Art", "Lecture", "Jeux Vidéo", "Nature", "Tech", "Mode",
  "Photo", "Animaux", "Yoga", "Théâtre"
];

export const INTENTIONS = [
  { key: "serious", label: "Relation sérieuse", emoji: "💘", desc: "Je cherche l'amour, le vrai" },
  { key: "casual", label: "Rencontre casual", emoji: "🔥", desc: "On se plaît, on verra bien" },
  { key: "friendship", label: "Amitié d'abord", emoji: "😊", desc: "Apprendre à se connaître" },
  { key: "open", label: "On verra bien", emoji: "🤷", desc: "Ouvert à toutes les possibilités" },
];

export const MOCK_PROFILES = [
  { id:"p1", firstName:"Léa", age:24, bio:"Passionnée de rando et de podcasts true crime. J'adore rire et découvrir de nouveaux endroits !", occupation:"Infirmière", passions:["Randonnée","Cuisine","Yoga"], photos:["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop","https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop","https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop"], grad:["#EC4899","#F43F5E"], intention:"serious", city:"Paris" },
  { id:"p2", firstName:"Thomas", age:28, bio:"Architecte le jour, musicien jazz la nuit. Un café et une bonne discussion, c'est tout ce qu'il me faut.", occupation:"Architecte", passions:["Jazz","Photo","Voyages"], photos:["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop","https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop"], grad:["#3B82F6","#6366F1"], intention:"casual", city:"Lyon" },
  { id:"p3", firstName:"Camille", age:26, bio:"Graphiste freelance, un peu geek, beaucoup escalade. Je cherche quelqu'un pour partager des aventures.", occupation:"Graphiste", passions:["Art Digital","Escalade","Séries SF"], photos:["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop","https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop","https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=400&h=600&fit=crop"], grad:["#10B981","#14B8A6"], intention:"friendship", city:"Marseille" },
  { id:"p4", firstName:"Hugo", age:30, bio:"Chef cuisinier passionné. Je voyage pour découvrir de nouvelles saveurs.", occupation:"Chef cuisinier", passions:["Gastronomie","Voyage","Vin"], photos:["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop","https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=600&fit=crop","https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=600&fit=crop"], grad:["#F59E0B","#EF4444"], intention:"serious", city:"Bordeaux" },
  { id:"p5", firstName:"Sofia", age:25, bio:"Danseuse et prof de yoga. L'énergie qu'on dégage compte plus que le physique.", occupation:"Danseuse", passions:["Danse","Yoga","Méditation"], photos:["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop","https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop","https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop"], grad:["#D946EF","#8B5CF6"], intention:"open", city:"Toulouse" },
];

// Seuils : photo1=20, photo2=40, photo3=60 (premium /2)
const THRESHOLDS = [20, 40, 60];
const THRESHOLDS_PREM = [10, 20, 30];

export const getPhotoBlur = (photoIndex: number, msgCount: number, isPrem: boolean): number => {
  const thresholds = isPrem ? THRESHOLDS_PREM : THRESHOLDS;
  const threshold = thresholds[photoIndex];
  if (msgCount >= threshold) return 0;
  const ratio = msgCount / threshold;
  return Math.round(28 * (1 - ratio));
};

export const isPhotoUnlocked = (photoIndex: number, msgCount: number, isPrem: boolean): boolean => {
  const thresholds = isPrem ? THRESHOLDS_PREM : THRESHOLDS;
  return msgCount >= thresholds[photoIndex];
};

export const getNextUnlockAt = (msgCount: number, isPrem: boolean): number | null => {
  const thresholds = isPrem ? THRESHOLDS_PREM : THRESHOLDS;
  const next = thresholds.find(t => t > msgCount);
  return next ?? null;
};

export const getMessagesLeft = (msgCount: number, isPrem: boolean): number => {
  const next = getNextUnlockAt(msgCount, isPrem);
  return next ? next - msgCount : 0;
};

export const getUnlockedCount = (msgCount: number, isPrem: boolean): number => {
  const thresholds = isPrem ? THRESHOLDS_PREM : THRESHOLDS;
  return thresholds.filter(t => msgCount >= t).length;
};

export const getTotalPct = (msgCount: number, isPrem: boolean): number => {
  const max = isPrem ? 30 : 60;
  return Math.min(100, Math.round((msgCount / max) * 100));
};

// Compat anciens composants
export const getBlur = (n: number, p: boolean) => getPhotoBlur(0, n, p);
export const getPct = (n: number, p: boolean) => getTotalPct(n, p);
export const getLeft = (n: number, p: boolean) => getMessagesLeft(n, p);
export const getIntention = (key: string) => INTENTIONS.find(i => i.key === key);