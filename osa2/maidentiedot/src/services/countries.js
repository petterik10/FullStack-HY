import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const findAllCountries = () => {
  const url = baseUrl + `/all`
  const request = axios.get(url);
  return request.then((response) => response.data);
};

export default { findAllCountries };
