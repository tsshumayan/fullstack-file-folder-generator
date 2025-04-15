const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", (req, res) => {
    const { frontend, path: customPath } = req.body;

    if (!frontend || !customPath) {
        return res.status(400).json({ message: "Frontend and path are required." });
    }

    const frontendDir = path.join(customPath, "frontend");
    const backendDir = path.join(customPath, "backend");

    try {
        // === FRONTEND SETUP ===
        fs.mkdirSync(frontendDir, { recursive: true });

        // Create assets folders
        const assetsPath = path.join(frontendDir, "assets");
        fs.mkdirSync(assetsPath, { recursive: true });
        fs.mkdirSync(path.join(assetsPath, "css"), { recursive: true });
        fs.mkdirSync(path.join(assetsPath, "js"), { recursive: true });
        fs.mkdirSync(path.join(assetsPath, "img"), { recursive: true });

        // Create style.css and custom.js
        fs.writeFileSync(path.join(assetsPath, "css", "style.css"), "/* Custom styles */");
        fs.writeFileSync(path.join(assetsPath, "js", "custom.js"), "// Custom JavaScript");

        if (frontend === "bootstrap") {
            fs.writeFileSync(path.join(frontendDir, "index.html"), `<!DOCTYPE html>
<html>
<head>
  <title>Bootstrap App</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="./assets/css/style.css" rel="stylesheet">
</head>
<body>
  <div class="container mt-5"><h1>Welcome to Bootstrap!</h1></div>
  <script src="./assets/js/custom.js"></script>
</body>
</html>`);
        }

        if (frontend === "tailwind") {
            fs.writeFileSync(path.join(frontendDir, "index.html"), `<!DOCTYPE html>
<html>
<head>
  <title>Tailwind App</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="./assets/css/style.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
  <div class="container mx-auto mt-10 text-center">
    <h1 class="text-3xl font-bold text-blue-600">Welcome to Tailwind CSS!</h1>
  </div>
  <script src="./assets/js/custom.js"></script>
</body>
</html>`);
        }

        if (frontend === "react") {
            fs.mkdirSync(path.join(frontendDir, "src"), { recursive: true });
            fs.writeFileSync(path.join(frontendDir, "package.json"), `{
  "name": "react-app",
  "scripts": {
    "start": "react-scripts start"
  }
}`);
            fs.writeFileSync(path.join(frontendDir, "src", "App.js"), `export default function App() {
  return <h1>Welcome to React App</h1>;
}`);
            fs.writeFileSync(path.join(frontendDir, "src", "index.js"), `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`);
        }

        if (frontend === "next") {
            fs.mkdirSync(path.join(frontendDir, "pages"), { recursive: true });
            fs.writeFileSync(path.join(frontendDir, "package.json"), `{
  "name": "next-app",
  "scripts": {
    "dev": "next dev"
  }
}`);
            fs.writeFileSync(path.join(frontendDir, "pages", "index.js"), `export default function Home() {
  return <h1>Welcome to Next.js!</h1>;
}`);
        }

        // === BACKEND SETUP ===
        fs.mkdirSync(backendDir, { recursive: true });

        ["controllers", "models", "routes", "config"].forEach((folder) => {
            fs.mkdirSync(path.join(backendDir, folder), { recursive: true });
        });

        // Sample controller
        fs.writeFileSync(path.join(backendDir, "controllers", "sampleController.js"), `exports.home = (req, res) => {
  res.send("Hello from controller");
};`);

        // Sample route
        fs.writeFileSync(path.join(backendDir, "routes", "sampleRoutes.js"), `const express = require('express');
const router = express.Router();
const { home } = require('../controllers/sampleController');

router.get('/', home);

module.exports = router;`);

        // Sample model
        fs.writeFileSync(path.join(backendDir, "models", "sampleModel.js"), `// Define Mongoose schema here`);

        // Config: db.js
        fs.writeFileSync(path.join(backendDir, "config", "db.js"), `const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(\`Error: \${error.message}\`);
    process.exit(1);
  }
};

module.exports = connectDB;
`);

        // Server
        fs.writeFileSync(path.join(backendDir, "server.js"), `const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const sampleRoutes = require("./routes/sampleRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use("/", sampleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
`);

        // .env
        fs.writeFileSync(path.join(backendDir, ".env"), `PORT=5000
MONGO_URI=mongodb://localhost:27017/mydb`);

        res.json({ message: "✅ Project structure created successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "❌ Failed to create project structure." });
    }
});

app.listen(5000, () => {
    console.log("🚀 Backend server running at http://localhost:5000");
});
