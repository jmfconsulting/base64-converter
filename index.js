const express = require("express");
const multer = require("multer");

const app = express();
const upload = multer();

// Endpoint que recibe un archivo y lo convierte a base64 en formato válido para OpenAI
app.post("/encode", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const base64 = req.file.buffer.toString("base64");

  // 🔑 Devolvemos exactamente lo que OpenAI espera: data:audio/mp3;base64,...
  res.send(`data:audio/mp3;base64,${base64}`);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
