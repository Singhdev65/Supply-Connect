import API from "@/api/api";
import { API_ENDPOINTS } from "@/utils/constants";

export const fetchMyProfileApi = async () => {
  const { data } = await API.get(API_ENDPOINTS.USERS_ME);
  return data?.data;
};

export const updateMyProfileApi = async (payload) => {
  const { data } = await API.put(API_ENDPOINTS.USERS_ME, payload);
  return data?.data;
};

export const createAddressApi = async (payload) => {
  const { data } = await API.post(API_ENDPOINTS.USERS_ME_ADDRESSES, payload);
  return data?.data;
};

export const updateAddressApi = async (addressId, payload) => {
  const { data } = await API.put(API_ENDPOINTS.USERS_ME_ADDRESS_BY_ID(addressId), payload);
  return data?.data;
};

export const deleteAddressApi = async (addressId) => {
  const { data } = await API.delete(API_ENDPOINTS.USERS_ME_ADDRESS_BY_ID(addressId));
  return data?.data;
};

export const setDefaultAddressApi = async (addressId) => {
  const { data } = await API.patch(API_ENDPOINTS.USERS_ME_ADDRESS_DEFAULT(addressId));
  return data?.data;
};
