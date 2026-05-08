require('dotenv').config();

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'sugartrack';

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
    Farmer: 'Farmer registered successfully',
    'Factory Admin': 'Factory registered successfully',
    'Field Staff': 'Field staff registered successfully',
    Driver: 'Driver registered successfully',
};
const emailOtpStore = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_ITERATIONS = 100000;
const PASSWORD_DIGEST = 'sha512';

function normalizeRole(roleFromBody, fallbackRole) {
    if (roleFromBody) return roleFromBody;
    return fallbackRole;
}

function hashPassword(password) {
    const salt = crypto.randomBytes(PASSWORD_SALT_BYTES).toString('hex');
    const hash = crypto
        .pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)
        .toString('hex');
    return `${salt}:${hash}`;
}

function verifyPassword(password, storedPasswordHash) {
    if (!storedPasswordHash || !password) return false;
    const [salt, expectedHash] = storedPasswordHash.split(':');
    if (!salt || !expectedHash) return false;

    const actualHash = crypto
        .pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)
        .toString('hex');

    const expectedBuffer = Buffer.from(expectedHash, 'hex');
    const actualBuffer = Buffer.from(actualHash, 'hex');

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

    await bootstrapConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
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
        [DB_NAME]
    );

    if (!passwordColumnRows.length) {
        await pool.query(`ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL AFTER email`);
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
        [DB_NAME]
    );

    if (!nodIdColumnRows.length) {
        await pool.query(`ALTER TABLE nodani ADD COLUMN nod_id VARCHAR(50) NULL AFTER id`);
    }
}

async function registerUser(req, res, fallbackRole) {
    try {
        const { name, phone, email, role, password } = req.body;
        const selectedRole = normalizeRole(role, fallbackRole);

        if (!selectedRole) {
            return res.status(400).send('Role is required');
        }

        if (!phone && !email) {
            return res.status(400).send('Phone or email is required');
        }

        if (!password) {
            return res.status(400).send('Password is required');
        }

        const passwordHash = hashPassword(String(password));

        await pool.query(
            `
            INSERT INTO users (name, phone, email, password_hash, role)
            VALUES (?, NULLIF(?, ''), NULLIF(?, ''), ?, ?)
            `,
            [name || null, phone || '', email || '', passwordHash, selectedRole]
        );

        return res.send(REGISTER_MESSAGES[selectedRole] || 'User registered successfully');
    } catch (error) {
        if (error && error.code === 'ER_DUP_ENTRY') {
            return res.status(409).send('User already exists with this phone or email');
        }

        console.error('Register failed:', error);
        return res.status(500).send('Unable to register user');
    }
}
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER || "",
        pass: process.env.EMAIL_PASS || "",
    },
});

app.post('/register-farmer', async (req, res) => registerUser(req, res, 'Farmer'));
app.post('/register-factory', async (req, res) => registerUser(req, res, 'Factory Admin'));
app.post('/register-field-staff', async (req, res) => registerUser(req, res, 'Field Staff'));
app.post('/register-driver', async (req, res) => registerUser(req, res, 'Driver'));

app.post('/send-email-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return res.status(500).json({ message: 'Email service not configured' });
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
            return res.status(500).json({ message: 'Unable to send email' });
        }
        return res.json({ message: 'Email sent successfully' });
    });
});

app.post('/verify-email-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const key = email.toLowerCase().trim();
    const entry = emailOtpStore.get(key);

    if (!entry) {
        return res.status(400).json({ message: 'Please request OTP first' });
    }

    if (Date.now() > entry.expiresAt) {
        emailOtpStore.delete(key);
        return res.status(400).json({ message: 'OTP expired. Request a new one' });
    }

    if (entry.otp !== String(otp).trim()) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    emailOtpStore.delete(key);
    return res.json({ message: 'Email verified successfully' });
});

app.post('/addCrops', async (req, res) => {
    try {

        const crops = req.body.crop;

        if (!crops) {
            return res.status(400).json({
                message: "Crop is required"
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
            crops: allCrops
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }
});

app.get('/getCrops', async (req, res) => {

    try {

        const [rows] = await pool.query(
            `SELECT * FROM crops ORDER BY id DESC`
        );

        res.json(rows);
        console.log("crops data", rows);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

app.delete('/deleteCrop/:id', async (req, res) => {

    try {

        const id = req.params.id;

        await pool.query(
            `DELETE FROM crops WHERE id = ?`,
            [id]
        );

        const [allCrops] = await pool.query(
            `SELECT * FROM crops ORDER BY id DESC`
        );

        res.json({
            message: "Crop deleted successfully",
            crops: allCrops
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }
});

app.post('/addNodani', async (req, res) => {

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
            image
        } = req.body;

        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
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
            image
        ]);

        res.status(201).json({
            message: "Nodani Added Successfully",
            insertedId: result.insertId
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

app.get('/getNodani/:farmerId', async (req, res) => {
    try {
        const { farmerId } = req.params;
        const [rows] = await pool.query(
            `SELECT * FROM nodani WHERE farmer_id = ? ORDER BY id DESC`,
            [farmerId]
        );
        res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { phone, email, role, loginMethod, password } = req.body;
        const value = loginMethod === 'email' ? email : phone;

        if (!value) {
            return res.status(400).send('Login value is required');
        }

        if (loginMethod === 'email' && !password) {
            return res.status(400).send('Password is required for email login');
        }

        const [rows] = await pool.query(
            `
            SELECT id, name, phone, email, role, password_hash
            FROM users
            WHERE ${loginMethod === 'email' ? 'email' : 'phone'} = ?
            AND role = ?
            LIMIT 1
            `,
            [value, role]
        );



        if (!rows.length) {
            return res.status(401).send('Invalid login details');
        }

        if (loginMethod === 'email' && !verifyPassword(String(password), rows[0].password_hash)) {
            return res.status(401).send('Invalid email or password');
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error('Login failed:', error);
        return res.status(500).send('Unable to login');
    }
});

ensureDatabaseAndTables()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`MySQL connected: ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });