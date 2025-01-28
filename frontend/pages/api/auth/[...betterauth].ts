import { NextApiRequest, NextApiResponse } from "next";
import auth from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const url = `${protocol}://${host}${req.url}`;

  const request = new Request(url, {
    method: req.method,
    headers: new Headers(req.headers as Record<string, string>),
    body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : null,
  });

  const response = await auth.handler(request);

  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  res.status(response.status).send(await response.text());
}
