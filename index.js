const cors = require('cors');
const express = require("express");
require("dotenv").config();

const routerPath = require("./utils/routes");
const mongoConnect = require("./utils/db").mongoConnect;

const app = express();

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ==================== CORS (TO‘G‘RI) ====================
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://ozodov-mirabzal.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// ❗ OPTIONS handle
app.options('*', cors());

// ==================== ROUTES ====================
app.use(routerPath);

// ==================== ERROR ====================
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error"
    });
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// ==================== MONGO ====================
let isConnected = false;

async function connectDB() {
    if (!isConnected) {
        await new Promise((resolve) => mongoConnect(resolve));
        isConnected = true;
    }
}

// ==================== ❗ VERCEL EXPORT ====================
module.exports = async (req, res) => {
    await connectDB();
    return app(req, res);
};
