import { useCallback, useEffect, useMemo, useState } from "react";
import { Home, Plus } from "lucide-react";
import { AppButton, AppCard, Breadcrumbs, PageContainer } from "@/shared/ui";
import { buildRoleHomePath } from "@/utils/constants";
import { useProfile } from "@/features/profile/hooks";
import { AddressCard, AddressForm, ProfileAvatarEditor } from "@/features/profile/components";

const emptyProfileForm = {
  name: "",
  phone: "",
  avatarUrl: "",
  bio: "",
};

const emptyAddressForm = {
  label: "",
  recipientName: "",
  phone: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

const Profile = () => {
  const {
    profile,
    loading,
    savingProfile,
    savingAddress,
    addressForm,
    addressErrors,
    setAddressForm,
    editingAddressId,
    saveProfile,
    saveAddress,
    deleteAddress,
    setDefaultAddress,
    startEditAddress,
    resetAddressForm,
  } = useProfile();

  const [profileForm, setProfileForm] = useState(emptyProfileForm);
  const [isAvatarEditMode, setIsAvatarEditMode] = useState(false);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  useEffect(() => {
    if (!profile) return;
    setProfileForm({
      name: profile.name || "",
      phone: profile.phone || "",
      avatarUrl: profile.avatarUrl || "",
      bio: profile.bio || "",
    });
  }, [profile]);

  useEffect(() => {
    if (editingAddressId) setIsAddressFormOpen(true);
  }, [editingAddressId]);

  const displayAvatar = useMemo(() => {
    if (profileForm.avatarUrl) return profileForm.avatarUrl;
    return "https://api.dicebear.com/9.x/adventurer/svg?seed=Guest";
  }, [profileForm.avatarUrl]);

  const handleAvatarFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Image size should be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarError("");
      setProfileForm((prev) => ({ ...prev, avatarUrl: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddressChange = useCallback((field, value) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  }, [setAddressForm]);

  const handleAddressFormCancel = useCallback(() => {
    resetAddressForm();
    setIsAddressFormOpen(false);
  }, [resetAddressForm]);

  const handleAddressEdit = useCallback((item) => {
    startEditAddress(item);
    setIsAddressFormOpen(true);
  }, [startEditAddress]);

  if (loading && !profile) {
    return (
      <PageContainer className="max-w-6xl">
        <p className="text-sm text-gray-500">Loading profile...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-6xl space-y-5 pb-24">
      <Breadcrumbs
        showBack
        items={[{ label: "Home", to: buildRoleHomePath(profile?.role) }, { label: "Profile" }]}
      />

      <AppCard className="overflow-hidden">
        <ProfileAvatarEditor
          displayAvatar={displayAvatar}
          name={profileForm.name}
          email={profile?.email}
          addressCount={(profile?.addresses || []).length}
          isEditMode={isAvatarEditMode}
          avatarError={avatarError}
          onToggleEdit={() => setIsAvatarEditMode((prev) => !prev)}
          onFileSelect={handleAvatarFileSelect}
        />

        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
          <input
            value={profileForm.name}
            onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Full name"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            value={profileForm.phone}
            onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="Phone"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            value={profile?.email || ""}
            readOnly
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 sm:col-span-2"
          />
          <textarea
            value={profileForm.bio}
            onChange={(e) => setProfileForm((prev) => ({ ...prev, bio: e.target.value }))}
            placeholder="Short bio"
            rows={3}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm sm:col-span-2"
          />
        </div>
      </AppCard>

      <AppCard className="space-y-4 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Address Book</h2>
            <p className="text-sm text-gray-500">
              Store multiple addresses and switch defaults instantly at checkout.
            </p>
          </div>
          <button
            onClick={() => {
              resetAddressForm();
              setAddressForm(emptyAddressForm);
              setIsAddressFormOpen(true);
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={14} />
            Add Address
          </button>
        </div>

        {isAddressFormOpen && (
          <AddressForm
            form={addressForm}
            errors={addressErrors}
            saving={savingAddress}
            isEditing={Boolean(editingAddressId)}
            onChange={handleAddressChange}
            onCancel={handleAddressFormCancel}
            onSubmit={saveAddress}
          />
        )}

        {(profile?.addresses || []).length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
            <Home className="mx-auto mb-2 text-gray-400" size={18} />
            No address saved yet.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {(profile?.addresses || []).map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onDelete={deleteAddress}
                onSetDefault={setDefaultAddress}
                onEdit={handleAddressEdit}
              />
            ))}
          </div>
        )}
      </AppCard>
    </PageContainer>
  );
};

export default Profile;
