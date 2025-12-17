// api.js (ROOT) - Vanilla, enterprise stable
const BASE_URL = "https://systemlave-production.up.railway.app"; // <-- change if needed
const API_PREFIX = "/api";
const TOKEN_KEY = "sl_token";

const UI = {
  safe(v){
    return (v===null||v===undefined) ? "" : String(v).replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
  },
  toast(text, isErr){
    const d=document.createElement("div");
    d.className="toast"+(isErr?" error":"");
    d.innerHTML=`<div class="t">${isErr?"⚠️":"✅"} පණිවිඩය</div><div class="d">${UI.safe(text)}</div>`;
    document.body.appendChild(d);
    setTimeout(()=>d.remove(), 2800);
  },
  todayISO(){
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone:"Asia/Colombo", year:"numeric", month:"2-digit", day:"2-digit"
    }).formatToParts(new Date());
    const y=parts.find(p=>p.type==="year").value;
    const m=parts.find(p=>p.type==="month").value;
    const d=parts.find(p=>p.type==="day").value;
    return `${y}-${m}-${d}`;
  },
  slTimeNow(){
    return new Date().toLocaleTimeString("en-GB", {timeZone:"Asia/Colombo", hour:"2-digit", minute:"2-digit"});
  },
  minutesBetween(o,i){
    const [oh,om]=o.split(":").map(Number);
    const [ih,im]=i.split(":").map(Number);
    return (ih*60+im)-(oh*60+om);
  },
  validateLeave({date,out_time,in_time,note}){
    if(!date||!out_time||!in_time||!note) throw new Error("කරුණාකර සියලුම තොරතුරු පුරවන්න.");
    const today=UI.todayISO();
    if(date < today) throw new Error("අතීත දින වලට leave දාන්න බැහැ.");
    const mins=UI.minutesBetween(out_time,in_time);
    if(mins<=0) throw new Error("IN time එක OUT time එකට පස්සේ දාන්න.");
    if(mins<30) throw new Error("අවම කාලය 30 මිනිත්තුයි.");
    if(mins>210) throw new Error("උපරිම කාලය පැය 3යි මිනිත්තු 30යි.");
  }
};

function getToken(){ return localStorage.getItem(TOKEN_KEY); }
function setToken(t){ localStorage.setItem(TOKEN_KEY, t); }
function clearToken(){ localStorage.removeItem(TOKEN_KEY); }

async function apiFetch(path, {method="GET", body, auth=true, download=false}={}){
  const headers = {};
  if(!download) headers["Content-Type"]="application/json";
  if(auth){
    const t=getToken();
    if(t) headers["Authorization"]=`Bearer ${t}`;
  }
  const url = `${BASE_URL}${API_PREFIX}${path}` + (path.includes("?") ? "&" : "?") + `_t=${Date.now()}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if(download){
    if(!res.ok){
      let msg=`HTTP ${res.status}`;
      try{ msg=(await res.json())?.message || msg; }catch{}
      throw new Error(msg);
    }
    return res;
  }

  let data=null;
  try{ data=await res.json(); }catch{}
  if(!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

const API = {
  departments: ()=> apiFetch("/public/departments",{auth:false}),
  register: (payload)=> apiFetch("/auth/register",{method:"POST", body:payload, auth:false}),
  login: (email,password)=> apiFetch("/auth/login",{method:"POST", body:{email,password}, auth:false}),

  notifMine: ()=> apiFetch("/notifications/mine"),
  notifRead: (id)=> apiFetch(`/notifications/read/${encodeURIComponent(id)}`, {method:"POST"}),

  pendingUsers: ()=> apiFetch("/admin/pending-users"),
  approveUser: (id)=> apiFetch(`/admin/approve-user/${encodeURIComponent(id)}`, {method:"POST"}),
  rejectUser: (id, reason)=> apiFetch(`/admin/reject-user/${encodeURIComponent(id)}`, {method:"POST", body:{reason}}),

  leaveRequest: (payload)=> apiFetch("/leave/request",{method:"POST", body:payload}),
  leaveMine: ()=> apiFetch("/leave/mine"),
  leaveAppeal: (id, note)=> apiFetch(`/leave/appeal/${encodeURIComponent(id)}`, {method:"POST", body:{note}}),

  hodPending: ()=> apiFetch("/hod/pending"),
  hodApprove: (id)=> apiFetch(`/hod/approve/${encodeURIComponent(id)}`, {method:"POST"}),
  hodReject: (id, reason)=> apiFetch(`/hod/reject/${encodeURIComponent(id)}`, {method:"POST", body:{reason}}),

  hrQueue: ()=> apiFetch("/hr/queue"),
  hrFinalizeApprove: (id)=> apiFetch(`/hr/finalize-approve/${encodeURIComponent(id)}`, {method:"POST"}),
  hrFinalizeReject: (id)=> apiFetch(`/hr/finalize-reject/${encodeURIComponent(id)}`, {method:"POST"}),
  hrUnregistered: (payload)=> apiFetch("/hr/unregistered",{method:"POST", body:payload}),

  adminAppeals: ()=> apiFetch("/admin/appeals"),
  adminAppealApprove: (id)=> apiFetch(`/admin/appeals/approve/${encodeURIComponent(id)}`, {method:"POST"}),
  adminAppealReject: (id)=> apiFetch(`/admin/appeals/reject/${encodeURIComponent(id)}`, {method:"POST"}),
  adminRequests: (params={})=>{
    const q=new URLSearchParams();
    for(const [k,v] of Object.entries(params)){
      if(v===null||v===undefined||v==="") continue;
      q.set(k,String(v));
    }
    const qs=q.toString()?`?${q.toString()}`:"";
    return apiFetch(`/admin/requests${qs}`);
  },
  adminReqApprove: (id)=> apiFetch(`/admin/requests/approve/${encodeURIComponent(id)}`, {method:"POST"}),
  adminReqReject: (id)=> apiFetch(`/admin/requests/reject/${encodeURIComponent(id)}`, {method:"POST"}),

  secPending: ()=> apiFetch("/security/pending"),
  secOut: (id)=> apiFetch(`/security/confirm-out/${encodeURIComponent(id)}`, {method:"POST"}),
  secIn: (id)=> apiFetch(`/security/confirm-in/${encodeURIComponent(id)}`, {method:"POST"}),

  reportHOD: (range={})=>{
    const q=new URLSearchParams(range).toString();
    return apiFetch(`/reports/hod${q?`?${q}`:""}`);
  },
  reportHR: (range={})=>{
    const q=new URLSearchParams(range).toString();
    return apiFetch(`/reports/hr${q?`?${q}`:""}`);
  },
  reportADMIN: (range={})=>{
    const q=new URLSearchParams(range).toString();
    return apiFetch(`/reports/admin${q?`?${q}`:""}`);
  },
  export: (scope, format, range={})=>{
    const qs=new URLSearchParams({scope, format, ...range}).toString();
    return apiFetch(`/reports/export?${qs}`, {download:true});
  }
};
