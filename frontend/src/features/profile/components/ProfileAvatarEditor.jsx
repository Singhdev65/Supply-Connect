import { memo } from "react";
import { Pencil, Upload } from "lucide-react";

const ProfileAvatarEditor = ({
  displayAvatar,
  name,
  email,
  addressCount,
  isEditMode,
  avatarError,
  onToggleEdit,
  onFileSelect,
}) => (
  <div className="bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-4 sm:p-6">
    <div className="flex items-center gap-4">
      <div className="relative">
        <img
          src={displayAvatar}
          alt="Profile avatar"
          className="h-24 w-24 rounded-2xl border border-gray-200 bg-white object-cover shadow-sm sm:h-28 sm:w-28"
        />
        <button
          onClick={onToggleEdit}
          className="absolute -right-2 -top-2 rounded-full bg-gray-900 p-2 text-white shadow hover:bg-black"
        >
          <Pencil size={14} />
        </button>
      </div>
      <div className="min-w-0">
        <p className="text-xl font-semibold text-gray-900">{name || "User"}</p>
        <p className="mt-1 text-sm text-gray-500">{email}</p>
        <p className="mt-2 text-xs text-gray-500">
          {addressCount} saved {addressCount === 1 ? "address" : "addresses"}
        </p>
      </div>
    </div>

    {isEditMode && (
      <div className="mt-4 rounded-xl border border-blue-100 bg-white p-3 sm:p-4">
        <p className="text-sm font-semibold text-gray-900">Upload profile image</p>
        <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-blue-300 bg-blue-50 px-3 py-4 text-sm font-medium text-blue-700 hover:bg-blue-100">
          <Upload size={14} />
          Choose image from device
          <input type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
        </label>
        <p className="mt-2 text-xs text-gray-500">Supported: jpg, png, webp. Max size: 2MB.</p>
        {avatarError ? <p className="mt-1 text-xs text-red-600">{avatarError}</p> : null}
      </div>
    )}
  </div>
);

export default memo(ProfileAvatarEditor);
