import React, { useState } from "react";
import theme from "../styles/theme";

interface BulkTaskAssignProps {
  selectedTasks: string[];
  teamMembers: any[];
  onClose: () => void;
  onAssign: () => void;
}

const BulkTaskAssign: React.FC<BulkTaskAssignProps> = ({
  selectedTasks,
  teamMembers,
  onClose,
  onAssign,
}) => {
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!assignedTo) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        "http://localhost:8000/api/v1/projects/tasks/bulk-assign",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            task_ids: selectedTasks,
            assigned_to: parseInt(assignedTo),
          }),
        }
      );

      if (response.ok) {
        onAssign();
        onClose();
      }
    } catch (error) {
      console.error("Error assigning tasks:", error);
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
          maxWidth: "450px",
          width: "100%",
          padding: "2rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: theme.colors.text.primary,
            marginBottom: "1rem",
          }}
        >
          Bulk Assign Tasks
        </h2>

        <p
          style={{
            fontSize: "0.875rem",
            color: theme.colors.text.secondary,
            marginBottom: "1.5rem",
          }}
        >
          Assign {selectedTasks.length} selected task
          {selectedTasks.length !== 1 ? "s" : ""} to a team member
        </p>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: theme.colors.text.primary,
              marginBottom: "0.5rem",
            }}
          >
            Assign To
          </label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="">Select team member...</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.username}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="btn-primary"
            disabled={loading || !assignedTo}
          >
            {loading ? "Assigning..." : "Assign Tasks"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkTaskAssign;
