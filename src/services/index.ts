import { serviceUrl } from '@/configs/common';
import { fetchJson } from '@/utils/http';

export const getAllUser = async () => {
  try {
    const baseUrl = serviceUrl;
    if (!baseUrl) return;
    const res: any = await fetchJson<any>(`${baseUrl}/all.json`);

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
              avatar: next.avatar.replace('{BASEDIR}', baseUrl),
            },
          };
        },
        {},
      );

    return resolvedResult;
  } catch {
    throw new Error('Server Error');
  }
};
