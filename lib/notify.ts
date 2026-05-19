const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = "Tech Procod <noreply@techprocod.com>";
const TO = "info@techprocod.com";

async function send(subject: string, html: string, to = TO) {
  if (!RESEND_KEY) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  }).catch(() => {});
}

export async function notifyNewInquiry(name: string, email: string, service: string) {
  await send(
    `New Inquiry from ${name}`,
    `<p><b>${name}</b> (${email}) submitted a new inquiry for <b>${service}</b>.</p><p><a href="https://techprocod.com/admin/inquiries">View in Admin Panel →</a></p>`
  );
}

export async function notifyLeaveApproved(employeeName: string, leaveType: string, fromDate: string, toDate: string) {
  await send(
    `Leave ${leaveType} Approved`,
    `<p>Your <b>${leaveType}</b> request from <b>${fromDate}</b> to <b>${toDate}</b> has been <span style="color:green">approved</span>.</p>`,
  );
}

export async function notifyLeaveRejected(employeeName: string, leaveType: string, note: string) {
  await send(
    `Leave ${leaveType} Rejected`,
    `<p>Your <b>${leaveType}</b> request has been <span style="color:red">rejected</span>.</p>${note ? `<p>Note: ${note}</p>` : ""}`,
  );
}

export async function notifyNewTask(taskTitle: string, assignedTo: string, project: string) {
  await send(
    `New Task Assigned: ${taskTitle}`,
    `<p>You have been assigned a new task: <b>${taskTitle}</b>${project ? ` on project <b>${project}</b>` : ""}.</p><p><a href="https://techprocod.com/admin/tasks">View Tasks →</a></p>`
  );
}
