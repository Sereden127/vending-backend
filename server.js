import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

// 🔥 PRUEBA DE VIDA
app.get("/", (req, res) => {
  res.send("Backend vending activo ✔");
});

// 🔥 CREATE PAYMENT (ORDER ID GENERADO EN BACKEND)
app.post("/create-payment", (req, res) => {

  // 👇 Datos que SÍ manda el frontend
  const { amount, seleccion, email } = req.body;

  // 🔥 ORDER ID GENERADO AQUÍ (NO LO CONTROLA EL CLIENTE)
  const orderId = "ORD-" + Date.now();

  // 👇 Construcción de parámetros del TPV
  const merchant = {
    Ds_Order: orderId,
    Ds_Amount: amount,
    Ds_Currency: "978",
    Ds_MerchantData: JSON.stringify({
      seleccion,
      email
    })
  };

  // 🔐 Base64
  const base64 = Buffer.from(JSON.stringify(merchant)).toString("base64");

  // 🔐 Firma
  const signature = crypto
    .createHmac("sha256", "MI_CLAVE")
    .update(base64)
    .digest("base64");

  // 📤 RESPUESTA AL FRONTEND
  res.json({
    orderId,
    Ds_MerchantParameters: base64,
    Ds_Signature: signature
  });
});

// 🚀 ARRANQUE
app.listen(3000, () => {
  console.log("Servidor activo");
});
