import config from "@/../config";
import axios from "axios";

export default {
  get(data, onSuccess, onError) {
    return axios
      .get(`${config.host}/attendance/${data}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      })
      .then(onSuccess)
      .catch(onError);
  },
  getPayday(data, onSuccess, onError) {
    return axios
      .get(
        `${config.host}/attendance/payday`,
        {
        params: {
            init_date: data.init_date,
            end_date: data.end_date
          }
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
        }
      )
      .then(onSuccess)
      .catch(onError);
  },
  post(data, onSuccess, onError) {
    return axios
      .post(`${config.host}/attendance`, data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      })
      .then(onSuccess)
      .catch(onError);
  }
};
