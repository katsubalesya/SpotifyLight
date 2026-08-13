// export const makeRequest = async (url: string, options?: RequestInit) => {
//     const token = getFromLS();
//   const response = await axios[options?.method](url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           ...options.headers
//         },
//         ...options
//         });

//   return response.data;
// };