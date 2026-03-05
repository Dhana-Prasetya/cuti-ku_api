export default class ErrorMapper extends Error {
    constructor(
        public message: string,
        public status: number,
    ) {
        super(message);
    }
}
