export interface ErrorResponse{
    response: {
        data: {
            message: string;
            status: string;
            body: unknown;
        }
    }
}