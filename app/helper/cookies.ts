import type { CookieOptions } from "@ioc:Adonis/Core/Response";

const accessTokenCookieHelper: Partial<CookieOptions> = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: "15m",
};

const refreshTokenCookieHelper: Partial<CookieOptions> = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: "7d",
};

const stageProperty = (
    stage: string,
): {
    accessTokenCookieHelper: Partial<CookieOptions>;
    refreshTokenCookieHelper: Partial<CookieOptions>;
} => {
    let secureStatus = true;
    let sameSiteStatus: Partial<CookieOptions>["sameSite"] = "strict";

    if (stage === "development") {
        secureStatus = false;
        sameSiteStatus = "lax";
    }

    return {
        accessTokenCookieHelper: {
            ...accessTokenCookieHelper,
            secure: secureStatus,
            sameSite: sameSiteStatus,
        },
        refreshTokenCookieHelper: {
            ...refreshTokenCookieHelper,
            secure: secureStatus,
            sameSite: sameSiteStatus,
        },
    };
};

export { accessTokenCookieHelper, refreshTokenCookieHelper, stageProperty };
