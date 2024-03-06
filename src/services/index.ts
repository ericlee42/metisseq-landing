import { serviceUrl } from '@/configs/common';
import axios from 'axios';

const _axios = axios.create({
  // baseURL: `${serviceUrl}`,
  timeout: 30000,
});

_axios.interceptors.response.use(
  (response) => {
    return response?.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);
_axios.interceptors.request.use((config) => {
  return config;
});

// Routes
// r.GET("/getvals", controllers.FindVals)
// r.GET("/vals/:id", controllers.FindVal)
// r.POST("/createvals", controllers.CreateVal)
// r.PATCH("/vals/:id", controllers.UpdateVal)
// r.DELETE("/vals/:id", controllers.DeleteVal)

// type ValInfo struct {
//     Name    string `json:"name"`
//     Avartar string `json:"avatar"`
//     Desc    string `json:"desc"`
//     Address string `json:"address"`
//     PubKey  string `json:"pubkey"`
//     Url     string `json:"url"`
//     Media   string `json:"media"`
//    }

export const getAllUser = async () => {
  try {
    if (!serviceUrl) return;
    const res: any = await _axios.get(`${serviceUrl}/all.json`);

    if (!res?.length) return null;
    const resolvedResult = res
      ?.filter((i: { seq_addr: any; address: any }) => i.seq_addr)
      .reduce(
        (
          prev: any,
          next: {
            seq_addr: any;
            address: string;
            avatar: string;
          },
        ) => {
          return {
            ...prev,
            [next?.address?.toLowerCase()]: {
              ...next,
              avatar: next.avatar.replace('{BASEDIR}', serviceUrl),
            },
          };
        },
        {},
      );

    return resolvedResult;
  } catch (e) {
    throw new Error('Server Error');
  }
};
