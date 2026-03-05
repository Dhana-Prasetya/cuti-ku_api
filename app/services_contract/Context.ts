// to extend the HttpContextContract with custom properties or methods.

declare module "@ioc:Adonis/Core/HttpContext" {
    interface HttpContextContract {
        user_id: any;
        jti: any;
    }
}
