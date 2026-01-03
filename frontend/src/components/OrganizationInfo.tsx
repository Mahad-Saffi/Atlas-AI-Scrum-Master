import React, { useState, useEffect } from "react";
import theme from "../styles/theme";

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
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "8px",
          background: theme.colors.brand.redGradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.text.white,
          fontWeight: theme.typography.fontWeight.bold,
          fontSize: theme.typography.fontSize.xs,
        }}
      >
        ORG
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.xs,
          }}
        >
          <h3
            style={{
              fontSize: theme.typography.fontSize["2xl"],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              margin: 0,
              textShadow: theme.shadows.sm,
            }}
          >
            {org.name}
          </h3>
          {org.is_owner && (
            <span
              style={{
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                background: theme.colors.background.hover,
                borderRadius: theme.borderRadius.sm,
                textTransform: "uppercase",
              }}
            >
              Owner
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
          }}
        >
          Created: {new Date(org.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default OrganizationInfo;
