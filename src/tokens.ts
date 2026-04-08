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
  { id:"p1", firstName:"Léa", age:24, bio:"Passionnée de rando et de podcasts true crime. J'adore rire et découvrir de nouveaux endroits !", occupation:"Infirmière", passions:["Randonnée","Cuisine","Yoga"], photoUrl:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop", grad:["#EC4899","#F43F5E"], lookingFor:"Relation sérieuse", intention:"serious", city:"Paris" },
  { id:"p2", firstName:"Thomas", age:28, bio:"Architecte le jour, musicien jazz la nuit. Un café et une bonne discussion, c'est tout ce qu'il me faut.", occupation:"Architecte", passions:["Jazz","Photo","Voyages"], photoUrl:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", grad:["#3B82F6","#6366F1"], lookingFor:"Quelqu'un de créatif", intention:"casual", city:"Lyon" },
  { id:"p3", firstName:"Camille", age:26, bio:"Graphiste freelance, un peu geek, beaucoup escalade. Je cherche quelqu'un pour partager des aventures.", occupation:"Graphiste", passions:["Art Digital","Escalade","Séries SF"], photoUrl:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop", grad:["#10B981","#14B8A6"], lookingFor:"Aventures et rires", intention:"friendship", city:"Marseille" },
  { id:"p4", firstName:"Hugo", age:30, bio:"Chef cuisinier passionné. Je voyage pour découvrir de nouvelles saveurs.", occupation:"Chef cuisinier", passions:["Gastronomie","Voyage","Vin"], photoUrl:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop", grad:["#F59E0B","#EF4444"], lookingFor:"Relation sérieuse", intention:"serious", city:"Bordeaux" },
  { id:"p5", firstName:"Sofia", age:25, bio:"Danseuse et prof de yoga. L'énergie qu'on dégage compte plus que le physique.", occupation:"Danseuse", passions:["Danse","Yoga","Méditation"], photoUrl:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop", grad:["#D946EF","#8B5CF6"], lookingFor:"Connexion authentique", intention:"open", city:"Toulouse" },
];

export const getBlur = (n: number, p: boolean) => p ? (n>=10?0:n>=5?8:n>=2?16:24) : (n>=20?0:n>=10?10:n>=5?18:28);
export const getPct = (n: number, p: boolean) => Math.min(100, Math.round((n / (p?10:20)) * 100));
export const getLeft = (n: number, p: boolean) => Math.max(0, (p?10:20) - n);
export const getIntention = (key: string) => INTENTIONS.find(i => i.key === key);