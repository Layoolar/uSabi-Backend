import { IBaseRequest, RequestWithAuth } from '../Utilities/Request';
import { User } from '@domain/Models';
import { successResponse } from '../Utilities/Response';
import {
    GoogleSignInDTO,
    LogInDTO,
    ResetPasswordDTO,
    SignUpDTO,
    UpdateInfoDTO,
    UpdatePassWordDTO,
    VerifyOtpDTO,
} from 'API/DTO';
import { IAccountService } from 'Service';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export class AccountController {
    constructor(private service: IAccountService) {
        this.service = service;
    }

    signUp: RequestHandler = async (
        req: IBaseRequest<SignUpDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.SignUp(req.body.data);

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    logIn: RequestHandler = async (
        req: IBaseRequest<LogInDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await this.service.LogIn(req.body.data);

            return successResponse(res, 'Successful', { ...user });
        } catch (err) {
            next(err);
        }
    };

    verifyEmail: RequestHandler = async (
        req: IBaseRequest<VerifyOtpDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await this.service.VerifyEmail(req.body.data);

            return successResponse(res, 'Email verified', { ...user });
        } catch (err) {
            next(err);
        }
    };

    googleSignIn: RequestHandler = async (
        req: IBaseRequest<GoogleSignInDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await this.service.GoogleSignIn(req.body.data);

            return successResponse(res, 'Successful', { ...user });
        } catch (err) {
            next(err);
        }
    };

    getUser: RequestHandler = async (
        req: RequestWithAuth,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await this.service.GetUser(req.auth!);

            return successResponse(res, 'Successful', { user });
        } catch (err) {
            next(err);
        }
    };

    getUserById: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await this.service.GetUserById(req.params.userId);

            return successResponse(res, 'Successful', { user });
        } catch (err) {
            next(err);
        }
    };

    updateInfo: RequestHandler = async (
        req: IBaseRequest<UpdateInfoDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.UpdateInfo(req.body.data, req.auth!);

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    updateUser: RequestHandler = async (
        req: IBaseRequest<Partial<User>>,
	res: Response,
	next: NextFunction,
    ) => {
        try {
            await this.service.UpdateDetails(
                req.body.data,
		res.locals.authData,
	    );

	    return successResponse(res, 'Successful');
	} catch (err) {
            next(err);
	}
    }

    updatePassword: RequestHandler = async (
        req: IBaseRequest<UpdatePassWordDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.UpdatePassword(req.body.data, req.auth!);

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    forgotPassword: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.ForgotPassword(req.params.email);

            return successResponse(
                res,
                `If ${req.params.email} has a valid account, it will receive an OTP shortly`,
            );
        } catch (err) {
            next(err);
        }
    };
    verifyOTP: RequestHandler = async (
        req: IBaseRequest<VerifyOtpDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const token = await this.service.VerifyOTP(req.body.data);

            return successResponse(res, `OTP verified successfully`, {
                otpToken: token.token,
            });
        } catch (err) {
            next(err);
        }
    };

    resetPassword: RequestHandler = async (
        req: IBaseRequest<ResetPasswordDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.ResetPassword(req.body.data);
            return successResponse(res, `Password reset successful`);
        } catch (err) {
            next(err);
        }
    };
}
