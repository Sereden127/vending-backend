import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

/**
 * 🔥 SIMULACIÓN DE BASE DE DATOS EN MEMORIA
 * (luego esto se sustituye por DB real o Fersomatic API)
 */
const orders = {};

// 🔹 HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Backend vending activo ✔");
});

/**
 * 🔹 CREAR PEDIDO
 * Esto NO paga nada. Solo crea orden.
 */
app.post("/create-order", (req, res) => {

  const { amount, seleccion } = req.body;

  const orderId = "ORD-" + Date.now();

  orders[orderId] = {
    orderId,
    amount,
    seleccion,
    status: "PENDING"
  };

  // 🔥 AQUÍ IRÍA EL TPV REAL DE FERSOMATIC
  // ahora lo simulamos como URL de pago externa
  const paymentUrl = `https://fersomaticweb.onrender.com/pago-ok-seleccion?orderId=${orderId}`;

  return res.json({
    orderId,
    paymentUrl
  });
});

/**
 * 🔹 CONSULTAR ESTADO
 */
app.get("/order/:id", (req, res) => {

  const order = orders[req.params.id];

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order);
});

/**
 * 🔹 SIMULAR CONFIRMACIÓN DE TPV (ESTO LUEGO LO HARÁ FERSOMATIC REAL)
 */
app.post("/confirm-payment", (req, res) => {

  const { orderId } = req.body;

  if (!orders[orderId]) {
    return res.status(404).json({ error: "Order not found" });
  }

  orders[orderId].status = "PAID";

  return res.json({
    ok: true,
    orderId,
    status: "PAID"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Backend vending activo en puerto", PORT);
});
