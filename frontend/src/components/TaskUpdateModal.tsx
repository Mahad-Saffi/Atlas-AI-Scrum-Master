import React, { useState, useEffect } from "react";

interface TaskUpdateModalProps {
  task: any;
  onClose: () => void;
  onUpdate: () => void;
  teamMembers: any[];
}

const TaskUpdateModal: React.FC<TaskUpdateModalProps> = ({
  task,
  onClose,
  onUpdate,
  teamMembers,
}) => {
  const [formData, setFormData] = useState({
    estimate_hours: task.estimate_hours || "",
    progress_percentage: task.progress_percentage || 0,
    due_date: task.due_date || "",
    status: task.status || "To Do",
    assigned_to: task.assigned_to || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        `http://localhost:8000/api/v1/projects/tasks/${task.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            estimate_hours: formData.estimate_hours
              ? parseInt(formData.estimate_hours)
              : null,
            progress_percentage: parseInt(
              formData.progress_percentage.toString()
            ),
            due_date: formData.due_date || null,
            status: formData.status,
            assigned_to: formData.assigned_to
              ? parseInt(formData.assigned_to)
              : null,
          }),
        }
      );

      if (response.ok) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(24, 28, 20, 0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="card-glass"
        style={{
          maxWidth: "500px",
          width: "100%",
          padding: "2rem",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#181C14",
            marginBottom: "1.5rem",
          }}
        >
          Update Task
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#3C3D37",
                marginBottom: "0.5rem",
              }}
            >
              Task Name
            </label>
            <div
              style={{
                padding: "0.75rem",
                background: "rgba(236, 223, 204, 0.5)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.9375rem",
                color: "#181C14",
              }}
            >
              {task.title}
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#3C3D37",
                marginBottom: "0.5rem",
              }}
            >
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              style={{ width: "100%" }}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#3C3D37",
                marginBottom: "0.5rem",
              }}
            >
              Assign To
            </label>
            <select
              value={formData.assigned_to}
              onChange={(e) =>
                setFormData({ ...formData, assigned_to: e.target.value })
              }
              style={{ width: "100%" }}
            >
              <option value="">Unassigned</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.username}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#3C3D37",
                marginBottom: "0.5rem",
              }}
            >
              Estimated Hours
            </label>
            <input
              type="number"
              value={formData.estimate_hours}
              onChange={(e) =>
                setFormData({ ...formData, estimate_hours: e.target.value })
              }
              placeholder="Enter hours"
              min="0"
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#3C3D37",
                marginBottom: "0.5rem",
              }}
            >
              Progress: {formData.progress_percentage}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progress_percentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  progress_percentage: parseInt(e.target.value),
                })
              }
              style={{
                width: "100%",
                height: "8px",
                borderRadius: "4px",
                background: `linear-gradient(to right, #697565 0%, #697565 ${formData.progress_percentage}%, #ECDFCC ${formData.progress_percentage}%, #ECDFCC 100%)`,
                outline: "none",
                appearance: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#3C3D37",
                marginBottom: "0.5rem",
              }}
            >
              Due Date
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              style={{ width: "100%" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskUpdateModal;
