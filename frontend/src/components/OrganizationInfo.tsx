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
        padding: "1.25rem 1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <div style={{ fontSize: "2rem" }}>🏢</div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.25rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.6rem",
              fontWeight: "700",
              color: "#ECDFCC",
              margin: 0,
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {org.name}
          </h3>
          {org.is_owner && (
            <span
              style={{
                fontSize: "0.625rem",
                fontWeight: "700",
                color: "#ECDFCC",
                padding: "0.125rem 0.375rem",
                background: "rgba(236, 223, 204, 0.2)",
                borderRadius: "var(--radius-sm)",
                textTransform: "uppercase",
              }}
            >
              Owner
            </span>
          )}
        </div>
        <div style={{ fontSize: "0.75rem", color: "#ECDFCC" }}>
          Created: {new Date(org.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default OrganizationInfo;
