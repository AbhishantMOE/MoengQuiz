import axios from "axios";
const BASE_URL = "/api/question";

export const createPoolQuestion = async (questionData) => {
  try {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    let resp = await axios.post(
      `${BASE_URL}/creating/poolQuestion`,
      questionData,
      config
    );

    return resp.data;
  } catch (err) {
    console.log(err);
  }
};

export const deletePool = async (poolId) => {
  try {
    console.log(poolId)
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    let resp = await axios.delete(
      `${BASE_URL}/creating/poolQuestion?poolId=${poolId}`, 
      config
    );

    return resp.data;
  } catch (err) {
    console.log(err);
  }
}
