import express from "express";
import cors from "cors";

const app = express();

// 🔥 CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// 🔥 JSON BODY
app.use(express.json());

// 🔥 HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Backend vending activo (SANDBOX) ✔");
});

// 🔥 CREATE PAYMENT (SANDBOX)
app.post("/create-payment", (req, res) => {
  try {

    console.log("SANDBOX REQUEST:", req.body);

    const { amount, seleccion, email } = req.body;

    const orderId = "SANDBOX-" + Date.now();

    const merchantData = {
      orderId,
      amount,
      seleccion,
      email,
      status: "OK_SANDBOX"
    };

    return res.json({
      orderId,

      Ds_MerchantParameters: Buffer
        .from(JSON.stringify(merchantData))
        .toString("base64"),

      Ds_Signature: "SANDBOX_SIGNATURE"
    });

  } catch (err) {
    return res.status(500).json({
      error: "SANDBOX ERROR",
      detail: err.message
    });
  }
});

// 🔥 PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 SANDBOX backend activo en puerto", PORT);
});
