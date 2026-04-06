import { AppCard, AppButton } from "@/shared/ui";

const formatDate = (value) =>
  value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "N/A";

const VendorPromotionsPanel = ({
  promotions,
  loading,
  form,
  setForm,
  saving,
  editingId,
  onSave,
  onEdit,
  onToggle,
  onArchive,
  onResetForm,
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
        Loading promotions...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AppCard className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingId ? "Edit Promotion" : "Create Promotion"}
          </h3>
          <button
            onClick={onResetForm}
            className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium"
          >
            Reset
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            placeholder="Code (e.g. FESTIVE20)"
            value={form.code}
            onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <select
            value={form.discountType}
            onChange={(e) => setForm((prev) => ({ ...prev, discountType: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
          <input
            type="number"
            min={1}
            placeholder="Discount value"
            value={form.discountValue}
            onChange={(e) => setForm((prev) => ({ ...prev, discountValue: Number(e.target.value || 0) }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={0}
            placeholder="Min order value"
            value={form.minOrderValue}
            onChange={(e) => setForm((prev) => ({ ...prev, minOrderValue: Number(e.target.value || 0) }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={0}
            placeholder="Max discount (0 = unlimited)"
            value={form.maxDiscount}
            onChange={(e) => setForm((prev) => ({ ...prev, maxDiscount: Number(e.target.value || 0) }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="datetime-local"
            value={form.startsAt}
            onChange={(e) => setForm((prev) => ({ ...prev, startsAt: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="datetime-local"
            value={form.endsAt}
            onChange={(e) => setForm((prev) => ({ ...prev, endsAt: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <textarea
          rows={2}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <div className="mt-3 flex items-center gap-2">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.autoApply}
              onChange={(e) => setForm((prev) => ({ ...prev, autoApply: e.target.checked }))}
            />
            Auto apply
          </label>
          <AppButton onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Promotion" : "Create Promotion"}
          </AppButton>
        </div>
      </AppCard>

      <AppCard className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Promotions</h3>
        <div className="mt-3 space-y-2">
          {promotions.length ? promotions.map((promotion) => (
            <div
              key={promotion._id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900">{promotion.title}</p>
                  <p className="text-xs text-gray-600">
                    Code: <span className="font-semibold">{promotion.code}</span> |{" "}
                    {promotion.discountType === "percentage"
                      ? `${promotion.discountValue}%`
                      : `Rs ${promotion.discountValue}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    Active: {formatDate(promotion.startsAt)} to {formatDate(promotion.endsAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(promotion)}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onToggle(promotion._id)}
                    className="rounded-md border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {promotion.isActive ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => onArchive(promotion._id)}
                    className="rounded-md border border-red-300 bg-red-50 px-3 py-1 text-xs font-medium text-red-700"
                  >
                    Archive
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <p className="text-sm text-gray-600">No promotions yet.</p>
          )}
        </div>
      </AppCard>
    </div>
  );
};

export default VendorPromotionsPanel;
