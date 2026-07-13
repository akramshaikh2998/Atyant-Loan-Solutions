document.addEventListener("DOMContentLoaded", () => {

  /* ================= AUTH & ROLE CHECK ================= */
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  if (!token || role !== "ADMIN") {
    window.location.href = "staff.html";
    return;
  }

  /* ================= ELEMENTS ================= */
  const adminName = document.getElementById("adminName");
  const mainContent = document.getElementById("main-content");
  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  adminName.textContent = username || "Admin";

  /* ================= PROFILE DROPDOWN ================= */
  if (profileBtn) {
    profileBtn.onclick = () => {
      profileDropdown.style.display =
        profileDropdown.style.display === "block" ? "none" : "block";
    };
  }

  /* ================= LOGOUT ================= */
  logoutBtn.onclick = () => {
    localStorage.clear();
    window.location.href = "../login/login.html";
  };

  /* ================= SIDEBAR NAV ================= */
  document.querySelectorAll(".nav-links li").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-links li")
        .forEach(x => x.classList.remove("active"));

      item.classList.add("active");

      const page = item.dataset.content;

      switch (page) {
        case "create": loadCreateUser(); break;
        case "delete": loadDeleteUser(); break;
        case "disbursement": loadDisbursement(); break;
        case "attendance": loadAttendance(); break;
        case "report": loadReport(); break;
      }
    });
  });

  /* ================= CREATE USER ================= */
  function loadCreateUser() {
    mainContent.innerHTML = `
      <h3>Create User</h3>
      <form id="createUserForm" class="col-md-6">
        <input class="form-control mb-2" id="cuUsername" placeholder="Username" required>
        <input type="password" class="form-control mb-2" id="cuPassword" placeholder="Password" required>
        <select class="form-control mb-2" id="cuRole" required>
          <option value="">Select Role</option>
          <option value="ADMIN">Admin</option>
          <option value="STAFF">Staff</option>
        </select>
        <button class="btn btn-primary">Create User</button>
      </form>
      <div id="msg" class="mt-3"></div>
    `;

    document.getElementById("createUserForm").onsubmit = async e => {
      e.preventDefault();

      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          username: cuUsername.value.trim(),
          password: cuPassword.value.trim(),
          role: cuRole.value
        })
      });

      const data = await res.json();
      msg.textContent = data.message || data.error;

      if (res.ok) e.target.reset();
    };
  }

  /* ================= DELETE USER ================= */
  function loadDeleteUser() {
    mainContent.innerHTML = `
      <h3>Delete User</h3>
      <p class="text-muted">Delete module coming soon.</p>
    `;
  }

  /* ================= DISBURSEMENT ================= */
  function loadDisbursement() {
    mainContent.innerHTML = `
      <h3>Upload Disbursement</h3>
      <input id="userId" class="form-control mb-2" placeholder="Staff User ID">
      <input id="amount" class="form-control mb-2" placeholder="Amount">
      <button class="btn btn-success" id="uploadBtn">Upload</button>
      <div id="msg" class="mt-3"></div>
    `;

    document.getElementById("uploadBtn").onclick = async () => {
      const res = await fetch("http://localhost:3000/disbursement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          userId: userId.value,
          amount: amount.value
        })
      });

      const data = await res.json();
      msg.textContent = data.message || data.error;
    };
  }

  /* ================= ATTENDANCE ================= */
  function loadAttendance() {
    mainContent.innerHTML = `
      <h3>Attendance Report</h3>

      <div class="row mb-3">
        <div class="col-md-3">
          <input type="date" id="fromDate" class="form-control">
        </div>
        <div class="col-md-3">
          <input type="date" id="toDate" class="form-control">
        </div>
        <div class="col-md-3">
          <button class="btn btn-primary" id="filterBtn">Filter</button>
        </div>
        <div class="col-md-3 text-end">
          <button class="btn btn-success" id="downloadBtn">Download CSV</button>
        </div>
      </div>

      <table class="table table-bordered">
        <thead class="table-dark">
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="attendanceBody"></tbody>
      </table>
    `;

    const loadData = async (query = "") => {
      const res = await fetch(
        `http://localhost:3000/admin/attendance${query}`,
        { headers: { Authorization: "Bearer " + token } }
      );

      const data = await res.json();
      const body = document.getElementById("attendanceBody");
      body.innerHTML = "";

      if (!data.length) {
        body.innerHTML = `<tr><td colspan="3">No records found</td></tr>`;
        return;
      }

      data.forEach(r => {
        body.innerHTML += `
          <tr>
            <td>${r.USERNAME}</td>
            <td>${r.ATTENDANCE_DATE}</td>
            <td>${r.STATUS}</td>
          </tr>
        `;
      });
    };

    loadData();

    document.getElementById("filterBtn").onclick = () => {
      let q = "?";
      if (fromDate.value) q += `fromDate=${fromDate.value}&`;
      if (toDate.value) q += `toDate=${toDate.value}`;
      loadData(q);
    };

    document.getElementById("downloadBtn").onclick = async () => {
      const res = await fetch(
        "http://localhost:3000/admin/attendance/download",
        { headers: { Authorization: "Bearer " + token } }
      );

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance.csv";
      a.click();
      URL.revokeObjectURL(url);
    };
  }

  /* ================= REPORT ================= */
  function loadReport() {
    mainContent.innerHTML = `
      <h3>Reports</h3>
      <p class="text-muted">Report module coming soon.</p>
    `;
  }

});
