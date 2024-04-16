import { useSearchParams } from "next/navigation";

export default function useCustomParamsData() {
  const params = useSearchParams();

  // Function to encode data and update the query parameters
  const setDataInQueryParamsMethod = (values:any) => {
    const data = btoa(JSON.stringify(values));
    return data
  };

  // Function to decode data from query parameters
  const getDataFromQueryParamsMethod = () => {
    const queryParam = params.get("q");
    if (queryParam) {
      const decodedData = atob(queryParam);
      return JSON.parse(decodedData);
    }
    return null;
  };

  return {
    setDataInQueryParamsMethod,
    getDataFromQueryParamsMethod,
  };
}
