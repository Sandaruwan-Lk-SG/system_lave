
function fmtPlanned(l){ return `${l.plannedOut||"-"} – ${l.plannedIn||"-"}`; }
function fmtActual(l){ return `${l.actualOut||"-"} – ${l.actualIn||"-"}`; }
function renderLeaveCard(l, actionsHtml=""){
  return `<div class="item">
    <div class="row">
      <div><b>${UI.safe(l.empName||"")}</b> <span class="muted">(${UI.safe(l.empId||"")})</span></div>
      ${statusChip(l.status)}
    </div>
    <div class="meta">දිනය: ${UI.safe(l.date||"")} • Dept: ${UI.safe(l.deptName||"")}</div>
    <div class="meta">Planned: ${UI.safe(fmtPlanned(l))}</div>
    <div class="meta">Actual: ${UI.safe(fmtActual(l))}</div>
    <div class="meta">Minutes: ${UI.safe(l.minutes ?? "-")} • Close: ${UI.safe(l.closeType||"-")}</div>
    ${l.note?`<div class="meta">Note: ${UI.safe(l.note)}</div>`:""}
    ${actionsHtml ? `<div class="actions">${actionsHtml}</div>`:""}
  </div>`;
}
function renderUserRow(u, actionsHtml=""){
  return `<tr>
    <td>${UI.safe(u.empId||"")}</td>
    <td>${UI.safe(u.name||"")}</td>
    <td>${UI.safe(u.email||"")}</td>
    <td>${UI.safe(u.role||"")}</td>
    <td>${UI.safe(u.deptName||"")}</td>
    <td>${UI.safe(u.status||"")}${u.reason?`<div class="muted" style="font-size:12px;margin-top:4px">${UI.safe(u.reason)}</div>`:""}</td>
    <td>${actionsHtml}</td>
  </tr>`;
}
function renderUserCard(u, actionsHtml=""){
  return `<div class="item">
    <div class="row">
      <div><b>${UI.safe(u.name||"")}</b> <span class="muted">(${UI.safe(u.empId||"")})</span></div>
      <span class="badge">${UI.safe(u.status||"")}</span>
    </div>
    <div class="meta">${UI.safe(u.email||"")}</div>
    <div class="meta">Role: ${UI.safe(u.role||"")} • Dept: ${UI.safe(u.deptName||"")}</div>
    ${u.reason?`<div class="meta" style="color:var(--bad)">Reason: ${UI.safe(u.reason)}</div>`:""}
    ${actionsHtml ? `<div class="actions">${actionsHtml}</div>`:""}
  </div>`;
}
