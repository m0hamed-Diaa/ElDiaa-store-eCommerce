import Cookies from "universal-cookie";

const cookies = new Cookies();

const COOKIE_NAME = "auth";

const ONE_WEEK = 7 * 24 * 60 * 60;

interface AuthCookies {
    token: string;
    userId: number;
    role: string;
}

export const saveAuth = (data: AuthCookies) => {
    cookies.set(COOKIE_NAME, data, {
        path: "/",
        maxAge: ONE_WEEK,
        sameSite: "strict",
    });
};

export const getAuth = () => {
    return cookies.get(COOKIE_NAME);
};

export const removeAuth = () => {
    console.trace("AUTH REMOVED");

    cookies.remove(COOKIE_NAME, {
        path: "/",
    });
};

export const isAuthenticated = () => {
    return !!cookies.get(COOKIE_NAME)?.token;
};