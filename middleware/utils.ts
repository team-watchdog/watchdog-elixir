import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : "";

interface HeadersWithCookie{
    cookie: string;
}

export interface RequestWithCookie{
    headers: HeadersWithCookie;
}

export interface SignedPayload{
  id: number;
  type: "ADMIN" | "ORGANIZATION";
}

export function verifyToken(jwtToken: string) {
  try {
    return jwt.verify(jwtToken, JWT_SECRET);
  } catch (e) {
    console.log('e:', e);
    return null;
  }
}

export function getAppCookies(req: RequestWithCookie) {
    const parsedItems: {[key: string]: unknown} = {};
    if (req.headers.cookie) {
        const cookiesItems = req.headers.cookie.split('; ');
        cookiesItems.forEach(cookies => {
        const parsedItem = cookies.split('=');
        parsedItems[parsedItem[0]] = decodeURI(parsedItem[1]);
    });
    }
    return parsedItems;
}

export function getAuthUser(req: RequestWithCookie): SignedPayload | null {
  const cookieObject = getAppCookies(req);
  const account = verifyToken(cookieObject["token"] as string);

  if (!account) return null;
  return account as SignedPayload;
}