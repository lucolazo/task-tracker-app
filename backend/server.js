const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de la conexión a PostgreSQL usando las variables de entorno de Docker
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "task_react_db",
  port: process.env.DB_PORT || 5432,
});

// Crear la tabla automáticamente al iniciar el servidor
pool
  .query(
    `
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    nombre_proyecto VARCHAR(100) NOT NULL,
    tipo_actividad VARCHAR(50) NOT NULL,
    estado VARCHAR(30) NOT NULL,
    resumen VARCHAR(150) NOT NULL,
    descripcion TEXT,
    prioridad VARCHAR(20) NOT NULL,
    informador VARCHAR(100) NOT NULL,
    persona_asignada VARCHAR(100) NOT NULL,
    precondicion TEXT,
    fecha_creacion DATE NOT NULL,
    fecha_cierre DATE,
    sprint VARCHAR(50) NOT NULL
  );
`,
  )
  .catch((err) => console.error("Error al crear la tabla:", err));

// --- ENDPOINTS ---

// 1. Obtener todas las tareas
app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Crear una tarea
app.post("/api/tasks", async (req, res) => {
  const {
    nombre_proyecto,
    tipo_actividad,
    estado,
    resumen,
    descripcion,
    prioridad,
    informador,
    persona_asignada,
    precondicion,
    fecha_creacion,
    fecha_cierre,
    sprint,
  } = req.body;

  try {
    const query = `
      INSERT INTO tasks (nombre_proyecto, tipo_actividad, estado, resumen, descripcion, prioridad, informador, persona_asignada, precondicion, fecha_creacion, fecha_cierre, sprint)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;
    `;
    const values = [
      nombre_proyecto,
      tipo_actividad,
      estado,
      resumen,
      descripcion,
      prioridad,
      informador,
      persona_asignada,
      precondicion,
      fecha_creacion,
      fecha_cierre || null,
      sprint,
    ];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Actualizar / Editar una tarea
app.put("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nombre_proyecto,
    tipo_actividad,
    estado,
    resumen,
    descripcion,
    prioridad,
    informador,
    persona_asignada,
    precondicion,
    fecha_creacion,
    fecha_cierre,
    sprint,
  } = req.body;

  try {
    const query = `
      UPDATE tasks SET nombre_proyecto=$1, tipo_actividad=$2, estado=$3, resumen=$4, 
      descripcion=$5, prioridad=$6, informador=$7, persona_asignada=$8, precondicion=$9, 
      fecha_creacion=$10, fecha_cierre=$11, sprint=$12 WHERE id=$13 RETURNING *;
    `;
    const values = [
      nombre_proyecto,
      tipo_actividad,
      estado,
      resumen,
      descripcion,
      prioridad,
      informador,
      persona_asignada,
      precondicion,
      fecha_creacion,
      fecha_cierre || null,
      sprint,
      id,
    ];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Finalizar tarea (cambiar estado a Finalizada)
app.patch("/api/tasks/:id/finalize", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE tasks SET estado = 'Finalizada', fecha_cierre = CURRENT_DATE WHERE id = $1 RETURNING *",
      [id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Eliminar tarea
app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "Tarea eliminada con éxito" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
