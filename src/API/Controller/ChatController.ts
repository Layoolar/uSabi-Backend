import { IBaseRequest } from "@api/Utilities/Request";
import { successResponse } from "@api/Utilities/Response";
import { NextFunction, RequestHandler, Response } from "express";
import { IChatService } from "Service/ChatService";


export class ChatController {
    constructor(private readonly service: IChatService) {}

    chatWithAI: RequestHandler = async (
        req: IBaseRequest<string>,
	res: Response,
	next: NextFunction
    ) => {
        try {
            const aiResponse = await this.service.getResponse(req.body.data, req.auth!.userId);
	    successResponse(
		res, 'AI response retrieved and conversation recorded successfully', { aiResponse }
	    );
	} catch (err) {
            next(err);
	}
    }
}
