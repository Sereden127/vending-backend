import express from "express";
import crypto from "crypto";

const app = express();

// 🔥 IMPORTANTE: obligatorio en Render
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 CORS básico (evita problemas desde frontend)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});

// 🔥 HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Backend vending activo ✔");
});

// 🔥 CREATE PAYMENT
app.post("/create-payment", (req, res) => {
  try {

    console.log("📩 REQUEST RECIBIDA:", req.body);

    const { amount, seleccion, email } = req.body;

    if (!amount || !seleccion) {
      return res.status(400).json({
        error: "Faltan datos (amount o seleccion)"
      });
    }

    // 🔥 ORDER ID AUTOMÁTICO
    const orderId = "ORD-" + Date.now();

    // 🔥 PARAMETROS (SIMULACIÓN TPV)
    const merchant = {
      Ds_Order: orderId,
      Ds_Amount: amount,
      Ds_Currency: "978",
      Ds_MerchantData: JSON.stringify({
        seleccion,
        email
      })
    };

    const base64 = Buffer.from(JSON.stringify(merchant)).toString("base64");

    // 🔐 FIRMA (REEMPLAZA MI_CLAVE por tu clave real)
    const signature = crypto
      .createHmac("sha256", "MI_CLAVE")
      .update(base64)
      .digest("base64");

    // 🔥 RESPUESTA
    return res.json({
      orderId,
      Ds_MerchantParameters: base64,
      Ds_Signature: signature
    });

  } catch (err) {
    console.error("❌ ERROR BACKEND:", err);

    return res.status(500).json({
      error: "Error interno en backend",
      detail: err.message
    });
  }
});

// 🔥 PUERTO RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Backend vending activo en puerto", PORT);
});
