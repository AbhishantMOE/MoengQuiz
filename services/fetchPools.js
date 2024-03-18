import axios from "axios";
const BASE_URL = "/api/question";

export const fetchPool = async () => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const resp = await axios.get(`${BASE_URL}/creating/fetchPools`, config);
    return resp.data;
  } catch (err) {
    console.log(err);
  }
};

export const deletePool = async (poolId) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("1")
    const resp = await axios.delete(`${BASE_URL}/creating/fetchPools/${poolId}`, config);
    console.log("2")
    
    return resp.data;
  } catch (err) {
    console.log(err);
  }
}
