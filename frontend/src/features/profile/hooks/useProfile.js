import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createAddressApi,
  deleteAddressApi,
  fetchMyProfileApi,
  setDefaultAddressApi,
  updateAddressApi,
  updateMyProfileApi,
} from "@/features/profile/api";
import { setUserProfile } from "@/features/auth/store/authSlice";

const emptyAddress = {
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

const validateAddressForm = (form) => {
  const errors = {};
  if (!String(form.recipientName || "").trim()) errors.recipientName = "Recipient name is required";
  if (!String(form.phone || "").trim()) errors.phone = "Phone is required";
  if (!/^[0-9+\-() ]{7,20}$/.test(String(form.phone || "").trim())) {
    errors.phone = "Enter a valid phone number";
  }
  if (!String(form.line1 || "").trim()) errors.line1 = "Address line 1 is required";
  if (!String(form.city || "").trim()) errors.city = "City is required";
  if (!String(form.state || "").trim()) errors.state = "State is required";
  if (!String(form.postalCode || "").trim()) errors.postalCode = "Postal code is required";
  if (!/^[A-Za-z0-9\- ]{3,12}$/.test(String(form.postalCode || "").trim())) {
    errors.postalCode = "Enter a valid postal code";
  }
  if (!String(form.country || "").trim()) errors.country = "Country is required";
  return errors;
};

const useProfile = () => {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [addressErrors, setAddressErrors] = useState({});

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMyProfileApi();
      setProfile(data);
      dispatch(setUserProfile(data));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const saveProfile = useCallback(
    async (payload) => {
      setSavingProfile(true);
      try {
        const data = await updateMyProfileApi(payload);
        setProfile(data);
        dispatch(setUserProfile(data));
      } finally {
        setSavingProfile(false);
      }
    },
    [dispatch],
  );

  const resetAddressForm = useCallback(() => {
    setAddressForm(emptyAddress);
    setAddressErrors({});
    setEditingAddressId(null);
  }, []);

  const startEditAddress = useCallback((address) => {
    if (!address) return;
    setEditingAddressId(address.id);
    setAddressForm({
      label: address.label || "",
      recipientName: address.recipientName || "",
      phone: address.phone || "",
      line1: address.line1 || "",
      line2: address.line2 || "",
      landmark: address.landmark || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "India",
      isDefault: Boolean(address.isDefault),
    });
  }, []);

  const saveAddress = useCallback(async () => {
    const nextErrors = validateAddressForm(addressForm);
    setAddressErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSavingAddress(true);
    try {
      const data = editingAddressId
        ? await updateAddressApi(editingAddressId, addressForm)
        : await createAddressApi(addressForm);
      setProfile(data);
      dispatch(setUserProfile(data));
      resetAddressForm();
    } finally {
      setSavingAddress(false);
    }
  }, [addressForm, dispatch, editingAddressId, resetAddressForm]);

  const deleteAddress = useCallback(
    async (addressId) => {
      if (!addressId) return;
      setSavingAddress(true);
      try {
        const data = await deleteAddressApi(addressId);
        setProfile(data);
        dispatch(setUserProfile(data));
        if (editingAddressId === addressId) resetAddressForm();
      } finally {
        setSavingAddress(false);
      }
    },
    [dispatch, editingAddressId, resetAddressForm],
  );

  const setDefaultAddress = useCallback(
    async (addressId) => {
      if (!addressId) return;
      setSavingAddress(true);
      try {
        const data = await setDefaultAddressApi(addressId);
        setProfile(data);
        dispatch(setUserProfile(data));
      } finally {
        setSavingAddress(false);
      }
    },
    [dispatch],
  );

  const defaultAddress = useMemo(
    () => profile?.addresses?.find((address) => address.isDefault) || null,
    [profile?.addresses],
  );

  return {
    profile,
    loading,
    savingProfile,
    savingAddress,
    addressForm,
    addressErrors,
    setAddressForm,
    editingAddressId,
    defaultAddress,
    fetchProfile,
    saveProfile,
    saveAddress,
    deleteAddress,
    setDefaultAddress,
    startEditAddress,
    resetAddressForm,
  };
};

export default useProfile;
