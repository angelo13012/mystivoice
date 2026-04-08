import { T } from "../../tokens";

export function Inp({ label, icon:Icon, ...p }: any) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {label && <label style={{ fontSize:11, fontWeight:700, color:T.txD, textTransform:"uppercase", letterSpacing:1.5, marginLeft:4 }}>{label}</label>}
      <div style={{ position:"relative" }}>
        {Icon && <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:T.txD }}><Icon size={18}/></div>}
        <input style={{ width:"100%", background:T.bgEl, border:`1px solid ${T.bd}`, borderRadius:14, padding:Icon?"14px 16px 14px 44px":"14px 16px", color:T.tx, fontSize:15, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} {...p}/>
      </div>
    </div>
  );
}