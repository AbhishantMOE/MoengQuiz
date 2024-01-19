import axios from "axios";
const BASE_URL = "/api/question";

export const fetchPool = async () => {
  try {
    console.log("Iam here");
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const resp = await axios.get(`${BASE_URL}/creating/fetchPools`, config);
    console.log("Respppppp======", resp.data);
    return resp.data;
  } catch (err) {
    console.log(err);
  }
};
