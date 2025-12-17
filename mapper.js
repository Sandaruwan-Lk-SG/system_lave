
function normLeave(r){
  const pick=(...keys)=>{ for(const k of keys){ if(r && r[k]!==undefined && r[k]!==null) return r[k]; } return null; };
  const status = String(pick("status","leave_status")||"PENDING").toUpperCase();
  return {
    id: pick("id","leave_id","request_id"),
    date: pick("date","leave_date"),
    empId: pick("emp_id","employee_id","empId"),
    empName: pick("emp_name","employee_name","name","full_name"),
    deptId: pick("department_id","dept_id"),
    deptName: pick("department_name","department","dept_name"),
    plannedOut: pick("planned_out_time","planned_out","out_time"),
    plannedIn: pick("planned_in_time","planned_in","in_time"),
    actualOut: pick("actual_out_time","actual_out","security_out_time","out_confirmed_at"),
    actualIn: pick("actual_in_time","actual_in","security_in_time","in_confirmed_at"),
    minutes: pick("real_leave_minutes","real_minutes","minutes"),
    status,
    closeType: pick("close_type") || (status==="AUTO_CLOSED" ? "AUTO" : null),
    approvedBy: pick("approved_by","approved_chain","approved_by_chain"),
    note: pick("note","request_note") || "",
    appealUsed: !!pick("appeal_used","appealUsed"),
    appealNote: pick("appeal_note","appealNote") || "",
    rejectReason: pick("reject_reason","reason") || ""
  };
}
function normUser(u){
  const pick=(...keys)=>{ for(const k of keys){ if(u && u[k]!==undefined && u[k]!==null) return u[k]; } return null; };
  return {
    id: pick("id","user_id"),
    empId: pick("emp_id","empId"),
    name: pick("name","full_name"),
    email: pick("email"),
    role: String(pick("role")||"").toUpperCase(),
    deptId: pick("department_id","dept_id"),
    deptName: pick("department_name","department","dept_name") || "",
    status: String(pick("status","account_status")||"PENDING").toUpperCase(),
    reason: pick("reject_reason","reason") || ""
  };
}
