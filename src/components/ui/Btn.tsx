import { motion } from "framer-motion";
import { T } from "../../tokens";

export function Btn({ children, variant="primary", size="md", disabled, style, ...p }: any) {
  const v: any = {
    primary: { background:`linear-gradient(135deg,${T.ac},${T.acD})`, color:"#fff", boxShadow:`0 4px 24px ${T.acGlow}` },
    ghost: { background:"transparent", color:T.txM, border:`1px solid ${T.bdL}` },
    gold: { background:`linear-gradient(135deg,${T.gold},#D97706)`, color:"#fff", boxShadow:`0 4px 24px ${T.goldGlow}` },
    danger: { background:"transparent", color:T.rose, border:`1px solid rgba(244,63,94,0.2)` },
  };
  const sz: any = { sm:{padding:"8px 16px",borderRadius:12,fontSize:13}, md:{padding:"14px 24px",borderRadius:16,fontSize:15}, lg:{padding:"18px 32px",borderRadius:20,fontSize:16}, xl:{padding:"20px 40px",borderRadius:24,fontSize:17} };
  return (
    <motion.button whileTap={disabled?{}:{scale:0.96}} whileHover={disabled?{}:{scale:1.02}}
      style={{ border:"none", fontWeight:700, cursor:disabled?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity:disabled?0.5:1, fontFamily:"inherit", ...v[variant], ...sz[size], ...style }}
      disabled={disabled} {...p}>{children}</motion.button>
  );
}