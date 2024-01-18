import axios from "axios";
const BASE_URL = "/api/question";

export const createPool = async (poolData) => {
  try {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const resp = await axios.post(
      `${BASE_URL}/creating/pool`,
      poolData,
      config
    );
    return resp.data;
  } catch (err) {
    console.log(err);
  }
};
