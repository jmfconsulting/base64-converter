const express = require("express");
const multer = require("multer");

const app = express();
const upload = multer();

// Endpoint que recibe un archivo y lo convierte a base64 en formato válido para OpenAI
app.post("/encode", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  try {
    const base64 = req.file.buffer.toString("base64");

    // 🚫 Nunca usamos req.file.mimetype (porque a veces es audio/mpeg)
    // ✅ Siempre forzamos a audio/mp3 para evitar el error de OpenAI
    const result = `data:audio/mp3;base64,${base64}`;

    // Devolver texto plano sin JSON, exactamente como OpenAI lo quiere
    res.type("text/plain").send(result);
  } catch (err) {
    console.error("❌ Error encoding file:", err);
    res.status(500).send("Internal Server Error while encoding file");
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
