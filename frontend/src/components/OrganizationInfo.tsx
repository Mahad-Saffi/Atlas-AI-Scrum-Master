import React, { useState, useEffect } from "react";

interface Organization {
  id: string;
  name: string;
  description: string;
  owner_id: number;
  is_owner: boolean;
  created_at: string;
}

const OrganizationInfo: React.FC = () => {
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(
        "http://localhost:8000/api/v1/organizations/my-organization",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrg(data);
      }
    } catch (error) {
      console.error("Error fetching organization:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="card"
        style={{
          padding: "1.5rem",
          background: "rgba(236, 223, 204, 0.9)",
          border: "1px solid rgba(105, 117, 101, 0.3)",
        }}
      >
        <div className="spinner" />
      </div>
    );
  }

  if (!org) {
    return null;
  }

  return (
    <div
      className="card"
      style={{
        padding: "1.5rem",
        background: "rgba(236, 223, 204, 0.9)",
        border: "1px solid rgba(105, 117, 101, 0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            background: "linear-gradient(135deg, #697565 0%, #3C3D37 100%)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
          }}
        >
          🏢
        </div>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: "700",
              color: "#181C14",
              marginBottom: "0.25rem",
            }}
          >
            {org.name}
          </h3>
          {org.is_owner && (
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "#697565",
                padding: "0.25rem 0.5rem",
                background: "rgba(105, 117, 101, 0.2)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              OWNER
            </span>
          )}
        </div>
      </div>

      {org.description && (
        <p
          style={{
            fontSize: "0.875rem",
            color: "#3C3D37",
            marginBottom: "1rem",
            lineHeight: "1.5",
          }}
        >
          {org.description}
        </p>
      )}

      <div
        style={{
          fontSize: "0.8125rem",
          color: "#697565",
          paddingTop: "1rem",
          borderTop: "1px solid rgba(105, 117, 101, 0.2)",
        }}
      >
        Created: {new Date(org.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};

export default OrganizationInfo;
