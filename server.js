import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔥 “BASE DE DATOS” EN MEMORIA
const orders = {};

// 🟢 HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Backend vending activo ✔");
});

// 🟢 CREAR PEDIDO (TU NUEVO SISTEMA)
app.post("/create-order", (req, res) => {

  const { maquina, producto, importe } = req.body;

  if (!maquina || !producto) {
    return res.status(400).json({
      error: "Faltan datos (maquina o producto)"
    });
  }

  const orderId = "ORD-" + Date.now();

  orders[orderId] = {
    orderId,
    maquina,
    producto,
    importe: Number(importe ?? 0), // 🔥 puedes poner 0 o 0.01
    status: "PENDING",
    createdAt: new Date().toISOString()
  };

  console.log("🟢 Pedido creado:", orders[orderId]);

  return res.json({
    orderId,
    status: "PENDING"
  });
});

// 🟢 VER PEDIDO
app.get("/order/:id", (req, res) => {

  const order = orders[req.params.id];

  if (!order) {
    return res.status(404).json({
      error: "Order no encontrado"
    });
  }

  res.json(order);
});

// 🟢 (TEMPORAL) MARCAR COMO PAGADO
app.post("/mark-paid", (req, res) => {

  const { orderId } = req.body;

  if (!orders[orderId]) {
    return res.status(404).json({
      error: "Order no encontrado"
    });
  }

  orders[orderId].status = "PAID";

  console.log("💰 Pedido pagado:", orders[orderId]);

  res.json({
    ok: true,
    orderId,
    status: "PAID"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Backend vending activo en puerto", PORT);
});
