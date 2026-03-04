const accessTokenCookieHelper = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: "15m",
};

const refreshTokenCookieHelper = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: "7d",
};

export { accessTokenCookieHelper, refreshTokenCookieHelper };
