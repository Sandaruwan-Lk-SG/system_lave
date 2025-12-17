
function statusChip(status){
  const s=String(status||"PENDING").toUpperCase();
  const cls = s.includes("AUTO_CLOSED") ? "s-autoclosed" :
              s.includes("APPROVE") ? "s-approved" :
              s.includes("REJECT") ? "s-rejected" :
              s.includes("APPEAL") ? "s-appealed" : "s-pending";
  const label =
    (s==="PENDING_HOD"||s==="PENDING_HR"||s==="PENDING_ADMIN"||s==="PENDING") ? "බලාපොරොත්තු" :
    (s==="HR_APPROVED"||s==="APPROVED") ? "අනුමත" :
    (s==="HR_REJECTED"||s==="REJECTED_HOD"||s==="REJECTED_ADMIN"||s==="REJECTED") ? "ප්‍රතික්ෂේප" :
    (s==="APPEALED") ? "අභියාචනා" :
    (s==="AUTO_CLOSED") ? "ස්වයංක්‍රීයව වැසුණා" : s;
  return `<span class="status ${cls}">${label}</span>`;
}
function canAppeal(leave, role){
  const s=String(leave.status||"").toUpperCase();
  if(leave.appealUsed) return false;
  if(role==="EMPLOYEE") return (s==="REJECTED_HOD" || s==="REJECTED_ADMIN");
  if(role==="HOD") return (s==="REJECTED_ADMIN");
  return false;
}
