import express from "express";
import cors from "cors";

const app = express();

// 🔥 CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// 🔥 JSON PARSER
app.use(express.json());

// 🔥 HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Backend vending activo ✔");
});

// 🔥 CREATE PAYMENT (SANDBOX COHERENTE)
app.post("/create-payment", (req, res) => {

  try {

    const { amount, seleccion, email } = req.body;

    console.log("REQUEST:", req.body);

    const orderId = "ORD-" + Date.now();

    // 🔥 PAYLOAD COMPATIBLE CON VALIDACIÓN DE RETORNO
    const merchant = {
      Ds_Order: String(orderId),
      Ds_Amount: String(amount),
      Ds_Currency: "978",
      Ds_Response: "0000",          // ✔ CLAVE: simula pago OK
      Ds_MerchantData: String(seleccion),
      Ds_ConsumerLanguage: "1"
    };

    const Ds_MerchantParameters = Buffer
      .from(JSON.stringify(merchant))
      .toString("base64");

    return res.json({
      orderId,
      Ds_MerchantParameters,
      Ds_Signature: "SANDBOX_SIGNATURE"
    });

  } catch (err) {

    console.error("ERROR:", err);

    return res.status(500).json({
      error: "backend_error",
      detail: err.message
    });
  }
});

// 🔥 PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Backend vending activo en puerto", PORT);
});
