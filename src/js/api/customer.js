import { getToken } from "../helpers/helpers";
import { apiRequest, header, BASE_URL } from "./api";

const customersApi = {
  getCustomers: async (limit, page, search) => {
    const token = getToken();

    let url = `/api/customer?access-token=${token}`;
    if (limit) url += `&limit=${limit}`;
    if (page) url += `&page=${page}`;
    if (search) url += `&search=${search}`;

    if (token) return apiRequest("GET", BASE_URL + url, {}, header);
  },

  getCustomer: async (customerId) => {
    const token = getToken();

    if (token)
      return apiRequest(
        "GET",
        BASE_URL + `/api/customer/${customerId}?access-token=${token}`
      );
  },

  addCustomer: async (data) => {
    const token = getToken();

    if (token)
      return await apiRequest(
        "POST",
        BASE_URL + `/api/customer/create?access-token=${token}`,
        data,
        header
      );
  },

  addCustomerImage: async (customerId, data) => {
    const token = getToken();

    if (token)
      return apiRequest(
        "POST",
        BASE_URL +
          `/api/customer/${customerId}/image/create?access-token=${token}`,
        data,
        header
      );
  },

  deleteCustomerImage: async (customerId, imageId) => {
    const token = getToken();

    if (token)
      return apiRequest(
        "delete",
        BASE_URL +
          `/api/customer/${customerId}/image/delete/${imageId}?access-token=${token}`
      );
  },

  setMainCustomerImage: async (customerId, imageId) => {
    const token = getToken();

    if (token)
      return apiRequest(
        "PUT",
        BASE_URL +
          `/api/customer/${customerId}/set-main-image/${imageId}?access-token=${token}`,
        {},
        header
      );
  },

  updateCustomer: async (customerId, dataCustomer) => {
    const token = getToken();

    if (token)
      return apiRequest(
        "PUT",
        BASE_URL + `/api/customer/update/${customerId}?access-token=${token}`,
        dataCustomer,
        header
      );
  },

  updateMainImage: async (id, idImage) => {
    const token = getToken();

    if (token)
      return apiRequest(
        "PUT",
        BASE_URL +
          `/api/customer/${id}/set-main-image/${idImage}?access-token=${token}`
      );
  },

  getCustomerFacilities: async (limit, page, search, customerId) => {
    const token = getToken();

    let url = `/api/customer/${customerId}/facilities?access-token=${token}`;
    if (limit) url += `&limit=${limit}`;
    if (page) url += `&page=${page}`;
    if (search) url += `&search=${search}`;

    if (token) return apiRequest("GET", BASE_URL + url, {}, {});
  },

  getEquipmentCustomer: async (id) => {
    const token = getToken();

    if (token)
      return apiRequest(
        "GET",
        BASE_URL + `/api/customer/${id}/equipment?access-token=${token}`
      );
  },

  getNetwork: async (id) => {
    const token = getToken();

    if (token)
      return apiRequest(
        "GET",
        BASE_URL + `/api/customer/${id}/network?access-token=${token}`
      );
  },

  getConstruct: async (id) => {
    const token = getToken();

    if (token)
      return apiRequest(
        "GET",
        BASE_URL + `/api/customer/${id}/construct?access-token=${token}`
      );
  },

  deleteAll: async (id, typeId) => {
    const token = getToken();

    if (token)
      return apiRequest(
        "GET",
        BASE_URL +
          `/api/customer/${id}/image/${typeId}/delete-all?access-token=${token}`
      );
  },
};

export default customersApi;
