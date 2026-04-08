import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, User, Clock, ChevronRight, Headphones } from "lucide-react";
import { T } from "../tokens";
import { Btn } from "../components/ui/Btn";
import { Inp } from "../components/ui/Inp";

export function Auth({ mode, onToggle, onDone }: any) {
  const [f, setF] = useState({email:"",password:"",firstName:"",age:""});
  const [err, setErr] = useState("");

  const go = () => {
    setErr("");
    if(!f.email||!f.password) return setErr("Remplissez tous les champs.");
    if(f.password.length < 6) return setErr("Le mot de passe doit faire au moins 6 caractères.");
    if(mode==="signup"&&(!f.firstName||!f.age)) return setErr("Prénom et âge requis.");
    onDone({ email:f.email, password:f.password, firstName:mode==="signup"?f.firstName:f.email.split("@")[0], age:mode==="signup"?parseInt(f.age)||25:25 });
  };

  return (
    <motion.div initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}
      style={{ minHeight:"100vh", padding:24, background:T.bg, display:"flex", flexDirection:"column" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", maxWidth:400, margin:"0 auto", width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ width:56,height:56,borderRadius:18,margin:"0 auto 16px",background:`linear-gradient(135deg,${T.ac},${T.acD})`,display:"flex",alignItems:"center",justifyContent:"center" }}><Headphones size={28} color="#fff"/></div>
          <h2 style={{ fontSize:26,fontWeight:800,color:T.tx,marginBottom:6 }}>{mode==="login"?"Bon retour !":"Créer un compte"}</h2>
          <p style={{ fontSize:14,color:T.txM }}>{mode==="login"?"Connectez-vous":"Rejoignez l'aventure vocale"}</p>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
          {err&&<div style={{padding:"12px 16px",borderRadius:12,background:"rgba(244,63,94,0.1)",border:"1px solid rgba(244,63,94,0.2)",color:T.rose,fontSize:13,textAlign:"center"}}>{err}</div>}
          <Inp label="Email" icon={Mail} type="email" placeholder="votre@email.com" value={f.email} onChange={(e: any)=>setF({...f,email:e.target.value})}/>
          <Inp label="Mot de passe" icon={Lock} type="password" placeholder="••••••••" value={f.password} onChange={(e: any)=>setF({...f,password:e.target.value})}/>
          {mode==="signup"&&<motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} style={{display:"flex",flexDirection:"column",gap:16}}>
            <Inp label="Prénom" icon={User} placeholder="Marie" value={f.firstName} onChange={(e: any)=>setF({...f,firstName:e.target.value})}/>
            <Inp label="Âge" icon={Clock} type="number" placeholder="25" value={f.age} onChange={(e: any)=>setF({...f,age:e.target.value})}/>
          </motion.div>}
          <Btn size="lg" style={{width:"100%",marginTop:8}} onClick={go}>{mode==="login"?"Se connecter":"Créer mon compte"} <ChevronRight size={18}/></Btn>
          <button onClick={onToggle} style={{background:"none",border:"none",cursor:"pointer",color:T.ac,fontSize:14,fontWeight:600,fontFamily:"inherit",padding:8}}>
            {mode==="login"?"Pas encore de compte ? S'inscrire":"Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}