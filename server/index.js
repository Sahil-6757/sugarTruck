require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const nodemailer = require("nodemailer");
const mysql = require("mysql2/promise");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "sugartrack";

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

const REGISTER_MESSAGES = {
  Farmer: "Farmer registered successfully",
  "Factory Admin": "Factory registered successfully",
  "Field Staff": "Field staff registered successfully",
  Driver: "Driver registered successfully",
};
const emailOtpStore = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_ITERATIONS = 100000;
const PASSWORD_DIGEST = "sha512";

function normalizeRole(roleFromBody, fallbackRole) {
  if (roleFromBody) return roleFromBody;
  return fallbackRole;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(PASSWORD_SALT_BYTES).toString("hex");
  const hash = crypto
    .pbkdf2Sync(
      password,
      salt,
      PASSWORD_ITERATIONS,
      PASSWORD_KEY_LENGTH,
      PASSWORD_DIGEST,
    )
    .toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPasswordHash) {
  if (!storedPasswordHash || !password) return false;
  const [salt, expectedHash] = storedPasswordHash.split(":");
  if (!salt || !expectedHash) return false;

  const actualHash = crypto
    .pbkdf2Sync(
      password,
      salt,
      PASSWORD_ITERATIONS,
      PASSWORD_KEY_LENGTH,
      PASSWORD_DIGEST,
    )
    .toString("hex");

  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const actualBuffer = Buffer.from(actualHash, "hex");

  if (expectedBuffer.length !== actualBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

async function ensureDatabaseAndTables() {
  const bootstrapConnection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  await bootstrapConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``,
  );
  await bootstrapConnection.end();

  await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(120) NULL,
            phone VARCHAR(20) NULL,
            email VARCHAR(190) NULL,
            password_hash VARCHAR(255) NULL,
            role VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uniq_phone (phone),
            UNIQUE KEY uniq_email (email)
        )
    `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS crops (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        crop_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS drivers (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        vehicle VARCHAR(255) NOT NULL,
        vehicle_number VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS daily_reports (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        staff_id INT,
        staff_name VARCHAR(255),
        report_date DATETIME,
        farms_visited INT DEFAULT 0,
        issues_reported INT DEFAULT 0,
        deliveries_verified INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS deliveries (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        farmer_id INT,
        farmer_name VARCHAR(255),
        driver_id INT,
        driver_name VARCHAR(255),
        vehicle_number VARCHAR(50),
        weight VARCHAR(50),
        status VARCHAR(50) DEFAULT 'SCHEDULED',
        delivery_date DATE,
        delivery_time TIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS nodani (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        farmer_id INT,
        farmer_name VARCHAR(255),

        variety VARCHAR(255),
        plantation_date DATE,
        field_name VARCHAR(255),
        area VARCHAR(50),
        unit VARCHAR(50),
        soil_type VARCHAR(100),
        irrigation_method VARCHAR(100),
        notes TEXT,
        latitude VARCHAR(100),
        longitude VARCHAR(100),
        image LONGTEXT,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

  const [passwordColumnRows] = await pool.query(
    `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME = 'password_hash'
        LIMIT 1
        `,
    [DB_NAME],
  );

  if (!passwordColumnRows.length) {
    await pool.query(
      `ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL AFTER email`,
    );
  }

  const [nodIdColumnRows] = await pool.query(
    `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'nodani'
        AND COLUMN_NAME = 'nod_id'
        LIMIT 1
        `,
    [DB_NAME],
  );

  if (!nodIdColumnRows.length) {
    await pool.query(
      `ALTER TABLE nodani ADD COLUMN nod_id VARCHAR(50) NULL AFTER id`,
    );
  }

  const [driverVehNumColumnRows] = await pool.query(
    `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'drivers'
        AND COLUMN_NAME = 'vehicle_number'
        LIMIT 1
        `,
    [DB_NAME],
  );

  if (!driverVehNumColumnRows.length) {
    await pool.query(
      `ALTER TABLE drivers ADD COLUMN vehicle_number VARCHAR(255) NULL AFTER vehicle`,
    );
  }

  const [harvestDateColumnRows] = await pool.query(
    `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'nodani'
        AND COLUMN_NAME = 'expected_harvest_date'
        LIMIT 1
        `,
    [DB_NAME],
  );

  if (!harvestDateColumnRows.length) {
    await pool.query(
      `ALTER TABLE nodani ADD COLUMN expected_harvest_date DATE NULL, ADD COLUMN estimated_yield VARCHAR(100) NULL, ADD COLUMN harvest_notes TEXT NULL, ADD COLUMN harvest_status VARCHAR(50) NULL DEFAULT 'pending'`
    );
  }

  const [fieldStaffColumnRows] = await pool.query(
    `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'nodani'
        AND COLUMN_NAME = 'field_staff_id'
        LIMIT 1
        `,
    [DB_NAME],
  );

  if (!fieldStaffColumnRows.length) {
    await pool.query(`ALTER TABLE nodani ADD COLUMN field_staff_id INT NULL`);
  }

  const [verifiedLatColumnRows] = await pool.query(
    `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'nodani'
        AND COLUMN_NAME = 'verified_latitude'
        LIMIT 1
        `,
    [DB_NAME],
  );

  if (!verifiedLatColumnRows.length) {
    await pool.query(`ALTER TABLE nodani ADD COLUMN verified_latitude VARCHAR(100) NULL, ADD COLUMN verified_longitude VARCHAR(100) NULL, ADD COLUMN verification_condition VARCHAR(100) NULL, ADD COLUMN verification_notes TEXT NULL`);
  }

  const [verifiedByColumnRows] = await pool.query(
    `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'nodani'
        AND COLUMN_NAME = 'verified_by'
        LIMIT 1
        `,
    [DB_NAME],
  );

  if (!verifiedByColumnRows.length) {
    await pool.query(`ALTER TABLE nodani ADD COLUMN verified_by VARCHAR(255) NULL`);
  }

  const [verifiedAtColumnRows] = await pool.query(
    `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'nodani'
        AND COLUMN_NAME = 'verified_at'
        LIMIT 1
        `,
    [DB_NAME],
  );

  if (!verifiedAtColumnRows.length) {
    await pool.query(`ALTER TABLE nodani ADD COLUMN verified_at TIMESTAMP NULL`);
  }
}

async function registerUser(req, res, fallbackRole) {
  try {
    const { name, phone, email, role, password } = req.body;
    const selectedRole = normalizeRole(role, fallbackRole);

    if (!selectedRole) {
      return res.status(400).send("Role is required");
    }

    if (!phone && !email) {
      return res.status(400).send("Phone or email is required");
    }

    if (!password) {
      return res.status(400).send("Password is required");
    }

    const passwordHash = hashPassword(String(password));

    await pool.query(
      `
            INSERT INTO users (name, phone, email, password_hash, role)
            VALUES (?, NULLIF(?, ''), NULLIF(?, ''), ?, ?)
            `,
      [name || null, phone || "", email || "", passwordHash, selectedRole],
    );

    return res.send(
      REGISTER_MESSAGES[selectedRole] || "User registered successfully",

    );
  } catch (error) {
    if (error && error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .send("User already exists with this phone or email");
    }

    console.error("Register failed:", error);
    return res.status(500).send("Unable to register user");
  }
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
});

app.post("/register-farmer", async (req, res) =>
  registerUser(req, res, "Farmer"),
);
app.post("/register-factory", async (req, res) =>
  registerUser(req, res, "Factory Admin"),
);
app.post("/register-field-staff", async (req, res) =>
  registerUser(req, res, "Field Staff"),
);
app.post("/register-driver", async (req, res) =>
  registerUser(req, res, "Driver"),
);

app.post("/send-email-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ message: "Email service not configured" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  emailOtpStore.set(email.toLowerCase().trim(), {
    otp: String(otp),
    expiresAt: Date.now() + OTP_EXPIRY_MS,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "SugarTrack OTP",
    text: `Your OTP is ${otp}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Unable to send email" });
    }
    return res.json({ message: "Email sent successfully" });
  });
});

app.post("/verify-email-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const key = email.toLowerCase().trim();
  const entry = emailOtpStore.get(key);

  if (!entry) {
    return res.status(400).json({ message: "Please request OTP first" });
  }

  if (Date.now() > entry.expiresAt) {
    emailOtpStore.delete(key);
    return res.status(400).json({ message: "OTP expired. Request a new one" });
  }

  if (entry.otp !== String(otp).trim()) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  emailOtpStore.delete(key);
  return res.json({ message: "Email verified successfully" });
});

app.post("/addCrops", async (req, res) => {
  try {
    const crops = req.body.crop;

    if (!crops) {
      return res.status(400).json({
        message: "Crop is required",
      });
    }

    // Insert crop
    const insertSql = `
            INSERT INTO crops (crop_name)
            VALUES (?)
        `;

    await pool.query(insertSql, [crops]);

    // Fetch all crops
    const fetchSql = `
            SELECT * FROM crops
            ORDER BY id DESC
        `;

    const [allCrops] = await pool.query(fetchSql);

    res.status(201).json({
      message: "Crop added successfully",
      crops: allCrops,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.get("/getDrivers", async (req, res) => {
  try {
    const email = req.query.email;

    // 🔴 Check if email is missing
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    console.log("Incoming email:", email);

    const [rows] = await pool.query(
      `SELECT * FROM drivers WHERE email = ?`,
      [email.trim()], // ✅ remove accidental spaces
    );
    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getAllFarmers", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name FROM users WHERE role = 'Farmer' ORDER BY name ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getAllFieldStaff", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name FROM users WHERE role = 'Field Staff' ORDER BY name ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// --- FIELD STAFF: Submit Daily Report ---
app.post("/staff/submitDailyReport", async (req, res) => {
  try {
    const {
      staffId,
      staffName,
      date,
      farmsVisited,
      issuesReported,
      deliveriesVerified
    } = req.body;

    // Convert ISO string date from frontend to MySQL DATETIME format if necessary, 
    // or just store it directly if your MySQL handles ISO strings well.
    const sql = `
      INSERT INTO daily_reports (
        staff_id, 
        staff_name, 
        report_date, 
        farms_visited, 
        issues_reported, 
        deliveries_verified
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      staffId,
      staffName,
      new Date(date), // Formats the JS date for the DB
      farmsVisited,
      issuesReported,
      deliveriesVerified
    ]);

    res.status(201).json({
      message: "Daily report submitted successfully",
      reportId: result.insertId
    });
  } catch (error) {
    console.error("Error submitting daily report:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// --- FACTORY ADMIN: Get All Daily Reports ---
app.get("/admin/dailyReports", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM daily_reports ORDER BY report_date DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching daily reports:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getAllDrivers", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, vehicle, vehicle_number FROM drivers ORDER BY name ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/add-delivery", async (req, res) => {
  try {
    const { farmerId, farmerName, driverId, driverName, vehicleNumber, date, time } = req.body;
    const sql = `
      INSERT INTO deliveries (farmer_id, farmer_name, driver_id, driver_name, vehicle_number, delivery_date, delivery_time)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [farmerId, farmerName, driverId, driverName, vehicleNumber, date, time]);
    res.status(201).json({ message: "Delivery added successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/get-deliveries", async (req, res) => {
  try {
    const { staffId } = req.query;
    let query = `SELECT d.* FROM deliveries d`;
    let params = [];

    if (staffId) {
      // Join with nodani to find deliveries for farmers assigned to this staff
      query = `
        SELECT DISTINCT d.* 
        FROM deliveries d
        JOIN nodani n ON d.farmer_id = n.farmer_id
        WHERE n.field_staff_id = ?
      `;
      params = [staffId];
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/add-driver", async (req, res) => {
  try {
    const { name, phone, email, address, vehicle, vehicle_number } = req.body;
    const sql = `
            INSERT INTO drivers (name, phone, email, address, vehicle, vehicle_number)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
    await pool.query(sql, [
      name,
      phone,
      email,
      address,
      vehicle,
      vehicle_number,
    ]);
    res.status(201).json({
      message: "Driver added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});


app.delete('/deleteNodani/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query(`DELETE FROM nodani WHERE id = ?`, [id]);
    const [allCrops] = await pool.query(`SELECT * FROM nodani ORDER BY id DESC`);

    res.json({
      message: "Nodani deleted successfully",
      crops: allCrops,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.get("/getCrops", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM crops ORDER BY id DESC`);

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.delete("/deleteCrop/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query(`DELETE FROM crops WHERE id = ?`, [id]);
    const [allCrops] = await pool.query(`SELECT * FROM crops ORDER BY id DESC`);

    res.json({
      message: "Crop deleted successfully",
      crops: allCrops,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.post("/addNodani", async (req, res) => {
  try {
    const {
      farmerId,
      farmerName,

      variety,
      date,
      fieldName,
      area,
      unit,
      soil,
      irrigation,
      notes,
      latitude,
      longitude,
      image,
    } = req.body;

    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const nodId = `NOD-${year}-${randomNum}`;

    const sql = `
            INSERT INTO nodani (
                nod_id,
                farmer_id,
                farmer_name,

                variety,
                plantation_date,
                field_name,
                area,
                unit,
                soil_type,
                irrigation_method,
                notes,
                latitude,
                longitude,
                image
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const [result] = await pool.query(sql, [
      nodId,
      farmerId,
      farmerName,

      variety,
      date,
      fieldName,
      area,
      unit,
      soil,
      irrigation,
      notes,
      latitude,
      longitude,
      image,
    ]);

    res.status(201).json({
      message: "Nodani Added Successfully",
      insertedId: result.insertId,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.put("/declareHarvest/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, yield: estimatedYield, notes } = req.body;

    const sql = `
      UPDATE nodani 
      SET expected_harvest_date = ?, estimated_yield = ?, harvest_notes = ?, harvest_status = 'declared'
      WHERE id = ?
    `;

    await pool.query(sql, [date, estimatedYield, notes, id]);

    res.json({ message: "Harvest declaration submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/getNodani/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params;
    const [rows] = await pool.query(
      `SELECT * FROM nodani WHERE farmer_id = ? ORDER BY id DESC`,
      [farmerId],
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.put("/assignStaff", async (req, res) => {
  try {
    const { farmer_id, staff_id } = req.body;
    await pool.query(
      `UPDATE nodani SET field_staff_id = ? WHERE farmer_id = ?`,
      [staff_id, farmer_id]
    );
    res.json({ message: "Staff assigned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.put("/submitVerification/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { latitude, longitude, condition, notes, verifiedBy } = req.body;

    await pool.query(
      `UPDATE nodani SET 
        verified_latitude = ?, 
        verified_longitude = ?, 
        verification_condition = ?, 
        verification_notes = ?, 
        verified_by = ?,
        verified_at = CURRENT_TIMESTAMP,
        harvest_status = 'ready_for_delivery'
       WHERE farmer_id = ?`,
      [latitude, longitude, condition, notes, verifiedBy, farmerId]
    );

    res.json({ message: "Verification submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/staff/dashboard-stats", async (req, res) => {
  try {
    const { staffId } = req.query;

    // Assigned Farmers count
    const [farmerRows] = await pool.query(`
      SELECT COUNT(DISTINCT farmer_id) as count FROM nodani WHERE field_staff_id = ?
    `, [staffId]);
    const assignedFarmers = farmerRows[0].count;

    // Field Visits (Verifications today)
    const [visitRows] = await pool.query(`
      SELECT COUNT(*) as count FROM nodani 
      WHERE field_staff_id = ? 
      AND verified_at >= CURDATE()
    `, [staffId]);
    const fieldVisits = visitRows[0].count;

    // Issues Reported (Poor condition today)
    const [issueRows] = await pool.query(`
      SELECT COUNT(*) as count FROM nodani 
      WHERE field_staff_id = ? 
      AND verified_at >= CURDATE()
      AND verification_condition = 'poor'
    `, [staffId]);
    const issuesReported = issueRows[0].count;

    res.json({
      assignedFarmers,
      fieldVisits,
      issuesReported,
      pendingTasks: 0,
      deliveriesAssisted: 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/admin/dashboard-stats", async (req, res) => {
  try {
    const [farmerRows] = await pool.query(`SELECT COUNT(*) as count FROM users WHERE role = 'Farmer'`);
    const totalFarmers = farmerRows[0].count;

    const [cropRows] = await pool.query(`SELECT COUNT(*) as count FROM nodani`);
    const activeCrops = cropRows[0].count;

    const [deliveryRows] = await pool.query(`SELECT COUNT(*) as count FROM deliveries WHERE status != 'COMPLETED'`);
    const pendingDeliveries = deliveryRows[0].count;

    res.json({
      totalFarmers,
      activeCrops,
      pendingDeliveries,
      monthlyRevenue: "₹0.0L"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/admin/farmers", async (req, res) => {
  try {
    const { staffId } = req.query;
    let query = `
      SELECT 
        u.id, 
        u.name, 
        COUNT(n.id) as crops_count, 
        SUM(CAST(n.area AS DECIMAL(10,2))) as total_area,
        GROUP_CONCAT(n.harvest_status ORDER BY n.id) as harvest_statuses,
        GROUP_CONCAT(n.plantation_date ORDER BY n.id) as plantation_dates,
        GROUP_CONCAT(n.field_name ORDER BY n.id) as field_names,
        GROUP_CONCAT(n.nod_id ORDER BY n.id) as nod_ids,
        GROUP_CONCAT(IFNULL(n.verified_by, '') ORDER BY n.id) as verifiers,
        GROUP_CONCAT(IFNULL(n.verification_notes, '') ORDER BY n.id) as v_notes,
        GROUP_CONCAT(IFNULL(n.verified_at, '') ORDER BY n.id) as v_dates,
        GROUP_CONCAT(IFNULL(n.verification_condition, '') ORDER BY n.id) as v_conditions,
        MAX(n.field_staff_id) as max_field_staff_id
      FROM users u
      LEFT JOIN nodani n ON u.id = n.farmer_id
      WHERE u.role = 'Farmer'
    `;

    let queryParams = [];

    if (staffId) {
      query += ` AND n.field_staff_id = ?`;
      queryParams.push(staffId);
    }

    query += ` GROUP BY u.id, u.name`;

    const [rows] = await pool.query(query, queryParams);

    const formattedFarmers = rows.map(row => {
      let status = "GROWING";
      let color = "blue";

      const statuses = row.harvest_statuses ? row.harvest_statuses.split(',') : [];
      const dates = row.plantation_dates ? row.plantation_dates.split(',') : [];
      const nod_ids = row.nod_ids ? row.nod_ids.split(',') : [];
      const verifiers = row.verifiers ? row.verifiers.split(',') : [];
      const v_notes = row.v_notes ? row.v_notes.split(',') : [];
      const v_dates = row.v_dates ? row.v_dates.split(',') : [];
      const v_conditions = row.v_conditions ? row.v_conditions.split(',') : [];

      let verifiedBy = null;
      let verificationNotes = null;
      let verifiedAt = null;
      let verificationCondition = null;

      if (statuses.includes('ready_for_delivery')) {
        status = "VERIFIED & READY";
        color = "purple";
        const idx = statuses.indexOf('ready_for_delivery');
        if (idx !== -1) {
          verifiedBy = verifiers[idx] || null;
          verificationNotes = v_notes[idx] || null;
          verifiedAt = v_dates[idx] || null;
          verificationCondition = v_conditions[idx] || null;
        }
      } else if (statuses.includes('declared')) {
        status = "HARVEST READY";
        color = "green";
      } else {
        const needsPestControl = dates.some(dateStr => {
          if (!dateStr) return false;
          const plantedDate = new Date(dateStr);
          const diffDays = Math.ceil(Math.abs(new Date() - plantedDate) / (1000 * 60 * 60 * 24));
          return diffDays >= 180 && diffDays < 200;
        });

        if (needsPestControl) {
          status = "PEST CONTROL NEEDED";
          color = "orange";
        }
      }

      let location = "Unknown";
      if (row.field_names) {
        const fields = row.field_names.split(',');
        if (fields.length > 0 && fields[0]) {
          location = fields[0];
        }
      }

      return {
        id: row.id,
        name: row.name,
        location: location,
        nod_id: nod_ids.length > 0 && nod_ids[0] ? nod_ids[0] : "Multiple Crops",
        crops: row.crops_count || 0,
        area: (row.total_area || 0) + " acres",
        status: status,
        color: color,
        verifiedBy: verifiedBy,
        verificationNotes: verificationNotes,
        verifiedAt: verifiedAt,
        verificationCondition: verificationCondition
      };
    });

    res.json(formattedFarmers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { phone, email, role, loginMethod, password } = req.body;
    const value = loginMethod === "email" ? email : phone;

    if (!value) {
      return res.status(400).send("Login value is required");
    }

    if (loginMethod === "email" && !password) {
      return res.status(400).send("Password is required for email login");
    }

    const [rows] = await pool.query(
      `
            SELECT id, name, phone, email, role, password_hash
            FROM users
            WHERE ${loginMethod === "email" ? "email" : "phone"} = ?
            AND role = ?
            LIMIT 1
            `,
      [value, role],
    );

    if (!rows.length) {
      return res.status(401).send("Invalid login details");
    }

    if (
      loginMethod === "email" &&
      !verifyPassword(String(password), rows[0].password_hash)
    ) {
      return res.status(401).send("Invalid email or password");
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).send("Unable to login");
  }
});

ensureDatabaseAndTables()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `MySQL connected: ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
      );
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
