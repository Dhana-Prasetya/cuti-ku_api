const errorMapper = (error: any) => {
    if (error.name === "UserAlreadyExistsError") {
        return {
            publicResponse: standarizedResponse(
                null,
                409,
                "Email or phone number already registered !",
            ),
            logLevel: "warn",
            logMessage: "Register conflict: user exists",
        };
    }
};

const standarizedResponse = (result: any, code: number, message: string) => {
    let confirmation: string;

    if (code >= 400) {
        confirmation = "Failed";
    } else {
        confirmation = "Success";
    }
    // Standard response format
    return {
        statusCode: code,
        body: {
            status: confirmation,
            statusCode: code,
            data: result,
            message: message,
        },
    };
};
