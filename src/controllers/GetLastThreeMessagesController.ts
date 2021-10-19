import { Request, Response } from "express";
import { GetLastThreeMessagesService } from "../services/GetLastThreeMessagesService";

class GetLastThreeMessagesController {
  async handle(request: Request, response: Response) {
    const { message } = request.body;
    const { user_id } = request;
    const service = new GetLastThreeMessagesService();
    try {
      const result = await service.execute();
      return response.json(result);
    } catch (error) {
      return response.status(401).json({ error: error.message });
    }
  }
}

export { GetLastThreeMessagesController };
