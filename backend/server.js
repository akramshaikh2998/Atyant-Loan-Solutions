require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { getConnection } = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET;

/* ================= AUTH ================= */
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  let conn;

  try {
    conn = await getConnection();

    const r = await conn.execute(
      `SELECT id, username, role, login_count
       FROM users
       WHERE username=:u AND user_password=:p`,
      { u: username, p: password }
    );

    if (!r.rows.length)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = r.rows[0];

    await conn.execute(
      `UPDATE users SET login_count = login_count + 1 WHERE id=:id`,
      { id: user.ID }
    );

    const token = jwt.sign(
      { id: user.ID, username: user.USERNAME, role: user.ROLE },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, username: user.USERNAME, role: user.ROLE });

  } finally {
    if (conn) await conn.close();
  }
});

/* ================= STAFF DASHBOARD ================= */
app.get("/staff/dashboard", auth, async (req, res) => {
  if (req.user.role !== "STAFF")
    return res.status(403).json({ message: "Access denied" });

  let conn;
  try {
    conn = await getConnection();

    const loginCount = await conn.execute(
      `SELECT login_count FROM users WHERE id=:id`,
      { id: req.user.id }
    );

    const disbCount = await conn.execute(
      `SELECT COUNT(*) CNT FROM disbursement WHERE user_id=:id`,
      { id: req.user.id }
    );

    res.json({
      loginCount: loginCount.rows[0].LOGIN_COUNT,
      disbursementCount: disbCount.rows[0].CNT
    });

  } finally {
    if (conn) await conn.close();
  }
});

/* ================= MARK ATTENDANCE ================= */
app.post("/attendance", auth, async (req, res) => {
  if (req.user.role !== "STAFF")
    return res.status(403).json({ message: "Access denied" });

  let conn;
  try {
    conn = await getConnection();

    const check = await conn.execute(
      `SELECT COUNT(*) CNT
       FROM attendance
       WHERE user_id=:id
       AND attendance_date = TRUNC(SYSDATE)`,
      { id: req.user.id }
    );

    if (check.rows[0].CNT > 0)
      return res.json({ message: "Attendance already marked today" });

    await conn.execute(
      `INSERT INTO attendance (user_id, status)
       VALUES (:id, 'PRESENT')`,
      { id: req.user.id }
    );

    res.json({ message: "Attendance marked successfully" });

  } finally {
    if (conn) await conn.close();
  }
});

/* ================= ADMIN ATTENDANCE VIEW ================= */
app.get("/admin/attendance", auth, async (req, res) => {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ message: "Access denied" });

  const { fromDate, toDate } = req.query;
  let conn;

  try {
    conn = await getConnection();

    let q = `
      SELECT u.username,
             TO_CHAR(a.attendance_date,'YYYY-MM-DD') attendance_date,
             a.status
      FROM attendance a
      JOIN users u ON u.id = a.user_id
      WHERE 1=1
    `;
    const b = {};

    if (fromDate) {
      q += " AND a.attendance_date >= TO_DATE(:f,'YYYY-MM-DD')";
      b.f = fromDate;
    }
    if (toDate) {
      q += " AND a.attendance_date <= TO_DATE(:t,'YYYY-MM-DD')";
      b.t = toDate;
    }

    q += " ORDER BY a.attendance_date DESC";

    const r = await conn.execute(q, b);
    res.json(r.rows);

  } finally {
    if (conn) await conn.close();
  }
});

/* ================= ADMIN CSV DOWNLOAD ================= */
app.get("/admin/attendance/download", auth, async (req, res) => {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ message: "Access denied" });

  let conn;
  try {
    conn = await getConnection();

    const r = await conn.execute(`
      SELECT u.username,
             TO_CHAR(a.attendance_date,'YYYY-MM-DD') attendance_date,
             a.status
      FROM attendance a
      JOIN users u ON u.id = a.user_id
      ORDER BY a.attendance_date DESC
    `);

    let csv = "Username,Date,Status\n";
    r.rows.forEach(x => {
      csv += `${x.USERNAME},${x.ATTENDANCE_DATE},${x.STATUS}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.csv");
    res.send(csv);

  } finally {
    if (conn) await conn.close();
  }
});

/* ===== CHECK TODAY ATTENDANCE (STAFF) ===== */
app.get("/attendance/today", auth, async (req, res) => {
  if (req.user.role !== "STAFF") {
    return res.status(403).json({ message: "Access denied" });
  }

  let conn;
  try {
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT COUNT(*) CNT
       FROM attendance
       WHERE user_id = :id
       AND attendance_date = TRUNC(SYSDATE)`,
      { id: req.user.id }
    );

    res.json({
      marked: result.rows[0].CNT > 0
    });

  } finally {
    if (conn) await conn.close();
  }
});


/* ================= START ================= */
app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);
