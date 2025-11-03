import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchCurrentUser = async () => {
  const response = await axios.get(`${API_BASE_URL}/current_user`, {
    withCredentials: true,
  });
  return response.data; // user object or null
};

export const fetchTopSearches = async () => {
  const response = await axios.get(`${API_BASE_URL}/top-searches`, {
    withCredentials: true,
  });
  return response.data; // { topSearches: string[] }
};

export const postSearchTerm = async (term) => {
  const response = await axios.post(
    `${API_BASE_URL}/search`,
    { term },
    { withCredentials: true }
  );
  return response.data; // { images: {id,url}[] }
};

export const fetchUserHistory = async () => {
  const response = await axios.get(`${API_BASE_URL}/history`, {
    withCredentials: true,
  });
  return response.data; // { history: {term,timestamp}[] }
};
