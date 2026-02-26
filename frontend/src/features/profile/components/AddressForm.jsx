import { memo } from "react";
import { AppButton } from "@/shared/ui";

const AddressForm = ({
  form,
  errors,
  saving,
  isEditing,
  onChange,
  onCancel,
  onSubmit,
}) => (
  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
    <div className="grid gap-3 sm:grid-cols-2">
      <input
        value={form.label}
        onChange={(e) => onChange("label", e.target.value)}
        placeholder="Label (Home/Office)"
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      <input
        value={form.recipientName}
        onChange={(e) => onChange("recipientName", e.target.value)}
        placeholder="Recipient name"
        className={`rounded-lg px-3 py-2 text-sm ${
          errors.recipientName ? "border border-red-300 bg-red-50" : "border border-gray-300"
        }`}
      />
      <input
        value={form.phone}
        onChange={(e) => onChange("phone", e.target.value)}
        placeholder="Phone"
        className={`rounded-lg px-3 py-2 text-sm ${
          errors.phone ? "border border-red-300 bg-red-50" : "border border-gray-300"
        }`}
      />
      <input
        value={form.line1}
        onChange={(e) => onChange("line1", e.target.value)}
        placeholder="Address line 1"
        className={`rounded-lg px-3 py-2 text-sm ${
          errors.line1 ? "border border-red-300 bg-red-50" : "border border-gray-300"
        }`}
      />
      <input
        value={form.line2}
        onChange={(e) => onChange("line2", e.target.value)}
        placeholder="Address line 2"
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      <input
        value={form.landmark}
        onChange={(e) => onChange("landmark", e.target.value)}
        placeholder="Landmark"
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
      <input
        value={form.city}
        onChange={(e) => onChange("city", e.target.value)}
        placeholder="City"
        className={`rounded-lg px-3 py-2 text-sm ${
          errors.city ? "border border-red-300 bg-red-50" : "border border-gray-300"
        }`}
      />
      <input
        value={form.state}
        onChange={(e) => onChange("state", e.target.value)}
        placeholder="State"
        className={`rounded-lg px-3 py-2 text-sm ${
          errors.state ? "border border-red-300 bg-red-50" : "border border-gray-300"
        }`}
      />
      <input
        value={form.postalCode}
        onChange={(e) => onChange("postalCode", e.target.value)}
        placeholder="Postal code"
        className={`rounded-lg px-3 py-2 text-sm ${
          errors.postalCode ? "border border-red-300 bg-red-50" : "border border-gray-300"
        }`}
      />
      <input
        value={form.country}
        onChange={(e) => onChange("country", e.target.value)}
        placeholder="Country"
        className={`rounded-lg px-3 py-2 text-sm ${
          errors.country ? "border border-red-300 bg-red-50" : "border border-gray-300"
        }`}
      />
    </div>
    {Object.keys(errors).length > 0 ? (
      <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
        Please fix highlighted fields before saving address.
      </div>
    ) : null}

    <label className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700">
      <input
        type="checkbox"
        checked={form.isDefault}
        onChange={(e) => onChange("isDefault", e.target.checked)}
      />
      Set as default
    </label>

    <div className="mt-4 flex flex-wrap justify-end gap-2">
      <button
        onClick={onCancel}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Cancel
      </button>
      <AppButton onClick={onSubmit} disabled={saving}>
        {saving ? "Saving..." : isEditing ? "Update Address" : "Save Address"}
      </AppButton>
    </div>
  </div>
);

export default memo(AddressForm);
