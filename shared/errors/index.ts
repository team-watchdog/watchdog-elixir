export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

export class InternalError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InternalError";
    }
}

export class CustomError extends Error {
    type = "";

    constructor(message: string, type: string = "CUSTOM") {
        super(message);
        this.name = "CustomError";
        this.type = type;
    }
}