
function jwtPayload(t){
  try{
    const p=t.split(".")[1];
    const s=atob(p.replace(/-/g,'+').replace(/_/g,'/'));
    return JSON.parse(decodeURIComponent(escape(s)));
  }catch{return null}
}
async function doLogin(){
  try{
    const email=document.getElementById("email").value.trim();
    const password=document.getElementById("password").value;
    if(!email||!password) return UI.toast("කරුණාකර ඊමේල් සහ මුරපදය ඇතුළත් කරන්න.", true);
    const d=await API.login(email,password);
    setToken(d.token);
    const p=jwtPayload(d.token)||{};
    const role=String(p.role||"").toUpperCase();
    const map={EMPLOYEE:"employee.html",HOD:"hod.html",HR:"hr.html",ADMIN:"admin.html",SECURITY:"security.html"};
    location.href = map[role] || "index.html";
  }catch(e){
    UI.toast(e.message||"Login අසාර්ථකයි.", true);
  }
}
function doLogout(){
  clearToken();
  location.href="index.html";
}
