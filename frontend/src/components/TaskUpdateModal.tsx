import React, { useState, useEffect } from "react";
import theme from "../styles/theme";

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
        background: theme.colors.overlay.light,
        backdropFilter: theme.effects.backdropBlur.sm,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: theme.spacing.lg,
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
            fontSize: theme.typography.fontSize["2xl"],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing["2xl"],
          }}
        >
          Update Task
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: theme.spacing.xl }}>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
              }}
            >
              Task Name
            </label>
            <div
              style={{
                padding: theme.spacing.md,
                background: theme.colors.background.hover,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.base,
                color: theme.colors.text.primary,
              }}
            >
              {task.title}
            </div>
          </div>

          <div style={{ marginBottom: theme.spacing.xl }}>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
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

          <div style={{ marginBottom: theme.spacing.xl }}>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
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

          <div style={{ marginBottom: theme.spacing.xl }}>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
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

          <div style={{ marginBottom: theme.spacing.xl }}>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
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
                background: `linear-gradient(to right, ${theme.colors.brand.red} 0%, ${theme.colors.brand.red} ${formData.progress_percentage}%, ${theme.colors.background.hover} ${formData.progress_percentage}%, ${theme.colors.background.hover} 100%)`,
                outline: "none",
                appearance: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: theme.spacing["2xl"] }}>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
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
