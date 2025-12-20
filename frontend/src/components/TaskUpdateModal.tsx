import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  UserIcon,
  ClockIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

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
        background: "rgba(0, 0, 0, 0.7)",
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
        style={{
          maxWidth: "500px",
          width: "100%",
          padding: "2rem",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "rgba(17, 17, 24, 0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#f1f5f9",
            }}
          >
            Update Task
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "#f1f5f9",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <XMarkIcon style={{ width: "20px", height: "20px" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#94a3b8",
                marginBottom: "0.5rem",
              }}
            >
              Task Name
            </label>
            <div
              style={{
                padding: "0.75rem 1rem",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                fontSize: "0.9375rem",
                color: "#f1f5f9",
                border: "1px solid rgba(255, 255, 255, 0.08)",
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
                color: "#94a3b8",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <ChartBarIcon style={{ width: "16px", height: "16px" }} />
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#f1f5f9",
                fontSize: "0.9375rem",
                outline: "none",
              }}
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
                color: "#94a3b8",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <UserIcon style={{ width: "16px", height: "16px" }} />
              Assign To
            </label>
            <select
              value={formData.assigned_to}
              onChange={(e) =>
                setFormData({ ...formData, assigned_to: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#f1f5f9",
                fontSize: "0.9375rem",
                outline: "none",
              }}
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
                color: "#94a3b8",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <ClockIcon style={{ width: "16px", height: "16px" }} />
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
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#f1f5f9",
                fontSize: "0.9375rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#94a3b8",
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
                background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${formData.progress_percentage}%, rgba(255, 255, 255, 0.1) ${formData.progress_percentage}%, rgba(255, 255, 255, 0.1) 100%)`,
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
                color: "#94a3b8",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <CalendarIcon style={{ width: "16px", height: "16px" }} />
              Due Date
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#f1f5f9",
                fontSize: "0.9375rem",
                outline: "none",
              }}
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
              disabled={loading}
              style={{
                padding: "0.75rem 1.5rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#f1f5f9",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.75rem 1.5rem",
                background: loading
                  ? "rgba(220, 38, 38, 0.5)"
                  : "linear-gradient(135deg, #dc2626, #991b1b)",
                border: "none",
                borderRadius: "12px",
                color: "white",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
              }}
            >
              {loading ? "Updating..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskUpdateModal;
