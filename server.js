import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

const SECRET = "MI_CLAVE";

app.post("/create-payment", (req, res) => {

  const data = req.body;

  const merchant = {
    Ds_Order: data.orderId,
    Ds_Amount: data.amount,
    Ds_Currency: "978"
  };

  const base64 = Buffer.from(JSON.stringify(merchant)).toString("base64");

  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(base64)
    .digest("base64");

  res.json({
    Ds_MerchantParameters: base64,
    Ds_Signature: signature
  });
});

app.listen(3000, () => console.log("OK"));
