
function jwtPayload(t){
  try{
    const p=t.split(".")[1];
    const s=atob(p.replace(/-/g,'+').replace(/_/g,'/'));
    return JSON.parse(decodeURIComponent(escape(s)));
  }catch{return null}
}
function requireRole(roles){
  const t=getToken();
  if(!t){ location.href="index.html"; return null; }
  const p=jwtPayload(t)||{};
  const r=String(p.role||"").toUpperCase();
  if(Array.isArray(roles) && roles.length && !roles.includes(r)){
    const map={EMPLOYEE:"employee.html",HOD:"hod.html",HR:"hr.html",ADMIN:"admin.html",SECURITY:"security.html"};
    location.href = map[r] || "index.html";
    return null;
  }
  return p;
}
