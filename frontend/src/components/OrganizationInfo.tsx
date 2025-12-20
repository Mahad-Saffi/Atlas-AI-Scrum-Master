import React, { useState, useEffect } from "react";
import { BuildingOfficeIcon } from "@heroicons/react/24/solid";

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
      <div className="card p-6">
        <div className="spinner" />
      </div>
    );
  }

  if (!org) {
    return null;
  }

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-tertiary)] flex items-center justify-center">
        <BuildingOfficeIcon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            {org.name}
          </h3>
          {org.is_owner && (
            <span className="badge badge-primary text-xs">Owner</span>
          )}
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          Created: {new Date(org.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default OrganizationInfo;
