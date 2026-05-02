import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class McpGuard implements CanActivate {
  constructor(private readonly config: ConfigService) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new UnauthorizedException("Missing Authorization header")
    }

    const [type, token] = authHeader.split(" ")

    if (type !== "Bearer" || !token) {
      throw new UnauthorizedException("Invalid Authorization header format. Expected: Bearer <token>")
    }

    const validToken = this.config.get<string>("MCP_ACCESS_TOKEN")
    console.log("Received token:", token)
    console.log("Expected token:", validToken)

    if (token.trim() !== validToken) {
      throw new UnauthorizedException("Invalid access token")
    }

    return true
  }
}
