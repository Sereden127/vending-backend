import express from "express";
import cors from "cors";

const app = express();

// 🔥 CORS correcto
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// 🔥 BODY PARSER
app.use(express.json());

// 🔥 HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Backend vending activo (SANDBOX OK) ✔");
});

// 🔥 CREATE PAYMENT (SANDBOX CONSISTENTE)
app.post("/create-payment", (req, res) => {

  try {

    const { amount, seleccion, email } = req.body;

    console.log("SANDBOX REQUEST:", req.body);

    const orderId = "ORD-" + Date.now();

    // 🔥 ESTRUCTURA ESTABLE (COMPATIBLE CON TU RETORNO)
    const payload = {
      Ds_Order: orderId,
      Ds_Amount: amount,
      Ds_Currency: "978",
      Ds_MerchantData: {
        seleccion,
        email
      }
    };

    const Ds_MerchantParameters = Buffer
      .from(JSON.stringify(payload))
      .toString("base64");

    return res.json({
      orderId,
      Ds_MerchantParameters,
      Ds_Signature: "SANDBOX_SIGNATURE"
    });

  } catch (err) {
    console.error("ERROR BACKEND:", err);

    return res.status(500).json({
      error: "Backend error",
      detail: err.message
    });
  }
});

// 🔥 PORT RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Backend vending activo en puerto", PORT);
});
