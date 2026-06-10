import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();

// 🔥 CORS REAL (ESTO ES LO QUE TE FALTABA)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// 🔥 IMPORTANTE EN RENDER
app.use(express.json());

// 🔥 TEST DE VIDA
app.get("/", (req, res) => {
  res.send("Backend vending activo ✔");
});

// 🔥 CREATE PAYMENT
app.post("/create-payment", (req, res) => {
  try {

    console.log("📩 REQUEST:", req.body);

    const { amount, seleccion, email } = req.body;

    if (!amount || !seleccion) {
      return res.status(400).json({
        error: "Faltan datos"
      });
    }

    // 🔥 ORDER ID AUTOMÁTICO
    const orderId = "ORD-" + Date.now();

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

    const signature = crypto
      .createHmac("sha256", "MI_CLAVE")
      .update(base64)
      .digest("base64");

    return res.json({
      orderId,
      Ds_MerchantParameters: base64,
      Ds_Signature: signature
    });

  } catch (err) {
    console.error("ERROR:", err);

    return res.status(500).json({
      error: "Error interno",
      detail: err.message
    });
  }
});

// 🔥 PORT (RENDER O LOCAL)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Backend vending activo en puerto", PORT);
});
