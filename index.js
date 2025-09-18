const express = require("express");
const crypto = require("crypto");

const app = express();

// ✅ Tus credenciales de ACRCloud
const ACCESS_KEY = "bc913984dd714bd96f1c72583ba01301";
const SECRET_KEY = "2Jm4zb...tu_secret..."; // ⚠️ pega aquí tu Secret Key completa

// 🔑 Endpoint para generar firma para ACRCloud
app.get("/acr-sign", (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);

    // String EXACTO que ACRCloud exige
    const stringToSign = [
      "POST",
      "/v1/identify",
      ACCESS_KEY,
      "audio",          // <-- data_type
      "1",              // <-- signature_version
      timestamp
    ].join("\n");

    // Generar firma HMAC-SHA1 con secret key y salida en base64
    const signature = crypto
      .createHmac("sha1", SECRET_KEY)
      .update(stringToSign)
      .digest("base64");

    // Devolvemos también el stringToSign para debug
    res.json({
      access_key: ACCESS_KEY,
      timestamp,
      signature,
      stringToSign
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
