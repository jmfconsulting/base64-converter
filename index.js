const express = require("express");
const crypto = require("crypto");

const app = express();

// ✅ Tus credenciales de ACRCloud
const ACCESS_KEY = "bc913984dd714bd96f1c72583ba01301";
const SECRET_KEY = "2Jm4zb...tu_secret..."; // ⚠️ pon aquí tu Secret Key completa

// 🔑 Endpoint para generar firma para ACRCloud
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
