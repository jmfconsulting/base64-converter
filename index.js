const express = require("express");
const multer = require("multer");
const crypto = require("crypto");

const app = express();
const upload = multer();

// ✅ Tus credenciales de ACRCloud
const ACCESS_KEY = "bc913984dd714bd96f1c72583ba01301";
const SECRET_KEY = "2Jm4zb...tu_secret..."; // ⚠️ pega aquí tu Secret Key completa

// Endpoint que recibe un archivo y lo convierte a base64 en formato válido para OpenAI
app.post("/encode", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  try {
    const base64 = req.file.buffer.toString("base64");

    // 🚫 No usamos req.file.mimetype porque puede ser audio/mpeg
    // ✅ Siempre forzamos a audio/mp3 para evitar errores con OpenAI
    const result = `data:audio/mp3;base64,${base64}`;

    // Devolvemos texto plano, exactamente como lo espera OpenAI
    res.type("text/plain").send(result);
  } catch (err) {
    console.error("❌ Error encoding file:", err);
    res.status(500).send("Internal Server Error while encoding file");
  }
});

// 🔑 Nuevo endpoint para generar firma para ACRCloud
app.get("/acr-sign", (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);

    // String que exige ACRCloud
    const stringToSign = `POST\n/v1/identify\n${ACCESS_KEY}\naudio\n1\n${timestamp}`;

    // HMAC-SHA1 con secret key y salida en base64
    const signature = crypto
      .createHmac("sha1", SECRET_KEY)
      .update(stringToSign)
      .digest("base64");

    res.json({
      access_key: ACCESS_KEY,
      timestamp,
      signature,
    });
  } catch (err) {
    console.error("❌ Error generating ACRCloud signature:", err);
    res.status(500).json({ error: "Internal Server Error while signing" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
