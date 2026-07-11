document.addEventListener("DOMContentLoaded", () => {

  /* ===== AUTH + ROLE CHECK ===== */
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  if (!token || role !== "STAFF") {
    window.location.href = "dashboard.html";
    return;
  }

  /* ===== ELEMENTS ===== */
  const staffNameEl = document.getElementById("staffName");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginCountEl = document.getElementById("loginCount");
  const disbCountEl = document.getElementById("disbCount");
  const markAttendanceBtn = document.getElementById("markAttendance");

  if (staffNameEl) staffNameEl.textContent = username || "Staff";

  /* ===== LOGOUT ===== */
  logoutBtn.onclick = () => {
    localStorage.clear();
    window.location.href = "../login/login.html";
  };

  /* ===== LOAD DASHBOARD DATA ===== */
  async function loadDashboard() {
    try {
      const res = await fetch("http://localhost:3000/staff/dashboard", {
        headers: { Authorization: "Bearer " + token }
      });

      const data = await res.json();
      loginCountEl.textContent = data.loginCount ?? 0;
      disbCountEl.textContent = data.disbursementCount ?? 0;

    } catch {
      alert("Session expired");
      localStorage.clear();
      window.location.href = "../login/login.html";
    }
  }

  /* ===== CHECK TODAY ATTENDANCE ===== */
  async function checkAttendanceToday() {
    const res = await fetch("http://localhost:3000/attendance/today", {
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();

    if (data.marked) {
      markAttendanceBtn.disabled = true;
      markAttendanceBtn.textContent = "Attendance Marked Today";
      markAttendanceBtn.classList.remove("btn-warning");
      markAttendanceBtn.classList.add("btn-secondary");
    } else {
      markAttendanceBtn.disabled = false;
      markAttendanceBtn.textContent = "Mark Attendance";
      markAttendanceBtn.classList.remove("btn-secondary");
      markAttendanceBtn.classList.add("btn-warning");
    }
  }

  /* ===== MARK ATTENDANCE ===== */
  markAttendanceBtn.onclick = async () => {
    try {
      const res = await fetch("http://localhost:3000/attendance", {
        method: "POST",
        headers: { Authorization: "Bearer " + token }
      });

      const data = await res.json();
      alert(data.message);

      await checkAttendanceToday(); // refresh button state

    } catch {
      alert("Failed to mark attendance");
    }
  };

  /* ===== INIT ===== */
  loadDashboard();
  checkAttendanceToday();
});
