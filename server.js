import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend vending activo ✔");
});

app.post("/create-payment", (req, res) => {

  const { amount, seleccion, email } = req.body;

  const orderId = "ORD-" + Date.now();

  // 🔥 FORMATO COMPATIBLE CON TU SISTEMA ORIGINAL
  const merchant = {
    Ds_Order: orderId,
    Ds_Amount: amount,
    Ds_Currency: "978",
    Ds_MerchantData: seleccion,
    Ds_ConsumerLanguage: "1"
  };

  const datos = Buffer.from(JSON.stringify(merchant)).toString("base64");

  return res.json({
    orderId,
    Ds_MerchantParameters: datos,
    Ds_Signature: "SANDBOX"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend OK");
});
