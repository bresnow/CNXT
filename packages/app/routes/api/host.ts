import { json, LoaderFunction } from 'remix';

export const loader: LoaderFunction = ({ request, context }) => {
  let host = request.url;
  return json(host);
};
