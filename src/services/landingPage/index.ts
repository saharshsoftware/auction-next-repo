import axios from "axios";

export const fetchCountryData = async () => {
  try {
    const { data } = await axios.get(
      "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates%2Bcities.json"
    );
    return data;
  } catch (error) {
    return error;
  }
};
