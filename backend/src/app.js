const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const employeeRoutes = require("./routes/employee.routes");
const managerRoutes = require("./routes/manager.routes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://employee-attendance-system-9xcujw74u-aadii-19s-projects.vercel.app/",
    ],
    credentials: true,
  }),
);

app.use(express.json());

/* ── Route mounting ────────────────────────────────────────────────────── */
app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/manager", managerRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Server running" });
});

/* ── 404 handler (must be last) ────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

module.exports = app;
