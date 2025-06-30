import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { UserService } from "../user.service";
import { Observable } from "rxjs";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {

  }

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
      const request = context.switchToHttp().getRequest();

      const { userId } = request.session || {};

      if (userId) {
        const user = await this.userService.findOne(userId);
        request.currentUser = user;
      }

      return next.handle();
  }
}