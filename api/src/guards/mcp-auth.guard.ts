import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class McpGuard implements CanActivate {
  constructor(private readonly config: ConfigService) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers["mcp_token"] as string | undefined

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ForbiddenException("Missing or invalid Authorization header")
    }

    const token = authHeader.replace("Bearer ", "").trim()
    const validToken = this.config.get<string>("MCP_ACCESS_TOKEN")

    if (token !== validToken) {
      throw new ForbiddenException("Invalid MCP token provided")
    }
    return true
  }
}
