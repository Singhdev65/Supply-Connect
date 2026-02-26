import { memo } from "react";
import { MapPin, Pencil, Star, Trash2 } from "lucide-react";

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-sm font-semibold text-gray-900">
          {address.label || "Saved Address"}
          {address.isDefault ? " (Default)" : ""}
        </p>
        <p className="mt-1 text-sm text-gray-700">
          {address.recipientName}, {address.phone}
        </p>
      </div>
      <MapPin className="text-gray-400" size={16} />
    </div>
    <p className="mt-2 text-sm text-gray-600 leading-6">
      {address.line1}
      {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state}{" "}
      {address.postalCode}, {address.country}
    </p>

    <div className="mt-3 flex flex-wrap items-center gap-2">
      {!address.isDefault && (
        <button
          onClick={() => onSetDefault(address.id)}
          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
        >
          <Star size={12} />
          Set default
        </button>
      )}
      <button
        onClick={() => onEdit(address)}
        className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
      >
        <Pencil size={12} />
        Edit
      </button>
      <button
        onClick={() => onDelete(address.id)}
        className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
      >
        <Trash2 size={12} />
        Delete
      </button>
    </div>
  </div>
);

export default memo(AddressCard);
