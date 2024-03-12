import axios from "axios";
const BASE_URL = "/api/question";

export const getPoolQ = async (poolName) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      params: { poolName },
    };

    const resp = await axios.get(`${BASE_URL}/creating/fetchPoolQ`, config);
    return resp.data;
  } catch (err) {
    console.log(err);
  }
};
