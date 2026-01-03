import React, { useState } from "react";
import { UserGroupIcon, XMarkIcon } from "@heroicons/react/24/solid";

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
          maxWidth: "450px",
          width: "100%",
          padding: "2rem",
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
            marginBottom: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <UserGroupIcon style={{ width: "24px", height: "24px" }} />
            Bulk Assign Tasks
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

        <p
          style={{
            fontSize: "0.875rem",
            color: "#94a3b8",
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
              color: "#94a3b8",
              marginBottom: "0.5rem",
            }}
          >
            Assign To
          </label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
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
            onClick={handleAssign}
            disabled={loading || !assignedTo}
            style={{
              padding: "0.75rem 1.5rem",
              background:
                loading || !assignedTo
                  ? "rgba(220, 38, 38, 0.5)"
                  : "linear-gradient(135deg, #dc2626, #991b1b)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "0.9375rem",
              fontWeight: 600,
              cursor: loading || !assignedTo ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
            }}
          >
            {loading ? "Assigning..." : "Assign Tasks"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkTaskAssign;
