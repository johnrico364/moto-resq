"use client";

import { useEffect, useState } from "react";
import type { ServiceCategory, ServiceCategoryStatus } from "@/lib/settings/types";

export type ServiceCategoryModalMode = "create" | "edit";

function ServiceCategoryModalBody({
  mode,
  initial,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: {
  mode: ServiceCategoryModalMode;
  initial: ServiceCategory | null;
  onClose: () => void;
  onSubmit: (data: {
    serviceName: string;
    description: string;
    status: ServiceCategoryStatus;
  }) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}) {
  const [serviceName, setServiceName] = useState(
    () => (mode === "edit" && initial ? initial.serviceName : ""),
  );
  const [description, setDescription] = useState(
    () => (mode === "edit" && initial ? initial.description : ""),
  );
  const [status, setStatus] = useState<ServiceCategoryStatus>(
    () => (mode === "edit" && initial ? initial.status : "Active"),
  );

  return (
    <div className="modal-box rounded-2xl shadow-xl">
      <h3 className="mb-4 text-lg font-bold text-[#110D8C]">
        {mode === "create" ? "Create service category" : "Edit service category"}
      </h3>
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit({ serviceName, description, status });
        }}
      >
        <div className="space-y-2">
          <label htmlFor="svc-name" className="text-sm font-medium text-gray-600">
            Service name
          </label>
          <input
            id="svc-name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="input input-bordered w-full rounded-xl border-gray-200"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="svc-desc" className="text-sm font-medium text-gray-600">
            Description
          </label>
          <textarea
            id="svc-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered min-h-24 w-full rounded-xl border-gray-200"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="svc-status" className="text-sm font-medium text-gray-600">
            Status
          </label>
          <select
            id="svc-status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value === "Inactive" ? "Inactive" : "Active")
            }
            className="select select-bordered w-full rounded-xl border-gray-200"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        <div className="modal-action mt-2">
          <button
            type="button"
            className="btn btn-ghost rounded-xl"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn rounded-xl border-0 bg-blue-500 text-white hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function ServiceCategoryModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: {
  open: boolean;
  mode: ServiceCategoryModalMode;
  initial: ServiceCategory | null;
  onClose: () => void;
  onSubmit: (data: {
    serviceName: string;
    description: string;
    status: ServiceCategoryStatus;
  }) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const bodyKey = `${mode}-${initial?.mongoId ?? "create"}`;

  return (
    <div className="modal modal-open z-[100]">
      <div
        className="modal-backdrop bg-black/40"
        role="presentation"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />
      <ServiceCategoryModalBody
        key={bodyKey}
        mode={mode}
        initial={initial}
        onClose={onClose}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />
    </div>
  );
}
