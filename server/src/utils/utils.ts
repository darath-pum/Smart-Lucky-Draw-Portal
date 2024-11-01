import crypto from "crypto";
import { Request, Response } from "express";
import { ErrorCodes, ErrorMessage, SuccessCodes, SuccessMessage } from "../models/enums";
import { v5 } from "uuid";

/**
 * Function for sending success response with data
 * @param res Response object
 * @param data Data to be send. Can be null
 */
export function sendData(res: Response, data: any) {
    res.status(200).send({
        code: 200,
        data: data,
    });
}
export function sendMessage(res: Response, successCode: SuccessCodes, message?: string) {
    if (!message) {
        message = SuccessMessage.getMessage(successCode);
    }
    sendData(res, { message });
}

/**
 * Function for sending error response with error message to client
 * @param res Express response object
 * @param errorCode Error code number
 * @param message Error message
 */
export function sendError(
    res: Response,
    errorCode: ErrorCodes,
    message?: string
) {
    if (!message) {
        message = ErrorMessage.getMessage(errorCode);
    }
    res.status(400).send({
        code: errorCode,
        error: message,
    });
}

/**
 * Send unexpected error response back to client
 * @param res Response object
 * @param message Custom error message (optional)
 */

export function sendUnexpectError(res: Response, message?: string) {
    res.status(500).send({
        code: ErrorCodes.InternalServerError,
        error: message || "Server encounted unexpected error."
    });
}

/**
 * Convert input password into a sha256 hash password
 * @param pass origin password
 * @returns Hash 256 password string
 */
export function hashPassword(pass: string): string {
    // Creating a unique salt for a particular user
    const salt = process.env.PASSWORD_SALT || "Iamsosecure";

    return crypto.pbkdf2Sync(pass, salt, 1000, 64, `sha256`).toString(`hex`);
}

/**
 * Retrieve user's IP from request object
 * @param req Express request object
 */

export function getClientIP(req: Request): string {
    return req.header("x-forwarded-for") || req.socket.remoteAddress || "NO-IP";
}

export function generateUUID(val: string): string {
    const nameSpace = process.env.UUID_NAMESPACE || "68334742-881c-11ee-b9d1-0242ac120002";
    return v5(val, nameSpace)
}

export function createUniqueId() {
    try {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let prize_randomId = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            prize_randomId += characters.charAt(randomIndex);
        }
        return prize_randomId;
    } catch (error) {
        console.error(error);
    }
}
