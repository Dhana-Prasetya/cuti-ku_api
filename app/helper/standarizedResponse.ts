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
            data: result,
            message: message,
        },
    };
};

export default standarizedResponse;
