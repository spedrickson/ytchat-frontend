import { api } from "boot/axios";

export function getFullThread(parentId, store) {
  const apikey = store.state.apikey.apikey;
  console.log("in actions", parentId, apikey);

  const url = `/comments?key=${apikey}`;
  const headers = { Authorization: `${apikey}` };
  const payload = {
    filters: {
      parentId: parentId,
    },
    sort: {
      publishedAt: -1,
    },
    skip: 0,
    limit: 100,
  };
  console.log("payload", payload);
  return api.post(url, payload, { headers });
}
