import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { UserService } from "../user.service";
import { User } from "../user.entity";

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {

  }

  async use(request: Request, response: Response, next: NextFunction) {
    const { userId } = request.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);

      // @ts-ignore
      request.currentUser = user;
    }

    next();
  }
}