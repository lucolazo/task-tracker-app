import React, { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    nombre_proyecto: "",
    tipo_actividad: "Desarrollo",
    estado: "Pendiente",
    resumen: "",
    descripcion: "",
    prioridad: "Media",
    informador: "",
    persona_asignada: "",
    precondicion: "",
    fecha_creacion: new Date().toISOString().split("T")[0],
    fecha_cierre: "",
    sprint: "",
  });

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:5000/api/tasks/${editingId}`
      : "http://localhost:5000/api/tasks";

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setEditingId(null);
    setForm({
      nombre_proyecto: "",
      tipo_actividad: "Desarrollo",
      estado: "Pendiente",
      resumen: "",
      descripcion: "",
      prioridad: "Media",
      informador: "",
      persona_asignada: "",
      precondicion: "",
      fecha_creacion: new Date().toISOString().split("T")[0],
      fecha_cierre: "",
      sprint: "",
    });
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setForm({
      nombre_proyecto: task.nombre_proyecto,
      tipo_actividad: task.tipo_actividad,
      estado: task.estado,
      resumen: task.resumen,
      descripcion: task.descripcion || "",
      prioridad: task.prioridad,
      informador: task.informador,
      persona_asignada: task.persona_asignada,
      precondicion: task.precondicion || "",
      fecha_creacion: task.fecha_creacion
        ? task.fecha_creacion.split("T")[0]
        : "",
      fecha_cierre: task.fecha_cierre ? task.fecha_cierre.split("T")[0] : "",
      sprint: task.sprint,
    });
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de eliminar esta tarea?")) {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
      });
      fetchTasks();
    }
  };

  const handleFinalize = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}/finalize`, {
      method: "PATCH",
    });
    fetchTasks();
  };

  return (
    <div className="container my-5" style={{ maxWidth: "900px" }}>
      <h1 className="text-center mb-4">
        Gestor de Tareas de Software (Task React)
      </h1>

      {/* Formulario con los 12 campos solicitados */}
      <div className="card p-4 shadow-sm mb-5">
        <h3>{editingId ? "Editar Tarea" : "Nueva Tarea"}</h3>
        <form onSubmit={handleSubmit} className="row g-3 mt-2">
          <div className="col-md-6">
            <label className="form-label">Nombre del Proyecto</label>
            <input
              type="text"
              name="nombre_proyecto"
              className="form-control"
              value={form.nombre_proyecto}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Tipo de Actividad</label>
            <input
              type="text"
              name="tipo_actividad"
              className="form-control"
              value={form.tipo_actividad}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Estado</label>
            <select
              name="estado"
              className="form-control"
              value={form.estado}
              onChange={handleChange}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Finalizada">Finalizada</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Prioridad</label>
            <select
              name="prioridad"
              className="form-control"
              value={form.prioridad}
              onChange={handleChange}
            >
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Sprint</label>
            <input
              type="text"
              name="sprint"
              className="form-control"
              value={form.sprint}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-12">
            <label className="form-label">Resumen</label>
            <input
              type="text"
              name="resumen"
              className="form-control"
              value={form.resumen}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-12">
            <label className="form-label">Descripción</label>
            <textarea
              name="descripcion"
              className="form-control"
              value={form.descripcion}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="col-md-6">
            <label className="form-label">Informador</label>
            <input
              type="text"
              name="informador"
              className="form-control"
              value={form.informador}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Persona Asignada</label>
            <input
              type="text"
              name="persona_asignada"
              className="form-control"
              value={form.persona_asignada}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-12">
            <label className="form-label">Precondición</label>
            <input
              type="text"
              name="precondicion"
              className="form-control"
              value={form.precondicion}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Fecha de Creación</label>
            <input
              type="date"
              name="fecha_creacion"
              className="form-control"
              value={form.fecha_creacion}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Fecha de Cierre</label>
            <input
              type="date"
              name="fecha_cierre"
              className="form-control"
              value={form.fecha_cierre}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 mt-3">
            <button type="submit" className="btn btn-primary w-100">
              {editingId ? "Actualizar Tarea" : "Guardar Tarea"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary w-100 mt-2"
                onClick={() => {
                  setEditingId(null);
                }}
              >
                Cancelar Edición
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Listado de Tareas */}
      <div className="card p-4 shadow-sm">
        <h3>Listado de Tareas</h3>
        <div className="table-responsive mt-3">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Resumen</th>
                <th>Asignado</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No hay tareas registradas.
                  </td>
                </tr>
              ) : (
                tasks.map((t) => (
                  <tr key={t.id}>
                    <td>{t.nombre_proyecto}</td>
                    <td>{t.resumen}</td>
                    <td>{t.persona_asignada}</td>
                    <td>
                      <span
                        className={`badge ${t.estado === "Finalizada" ? "bg-success" : "bg-warning text-dark"}`}
                      >
                        {t.estado}
                      </span>
                    </td>
                    <td>{t.prioridad}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => handleEdit(t)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success me-1"
                        onClick={() => handleFinalize(t.id)}
                      >
                        Finalizar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(t.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
