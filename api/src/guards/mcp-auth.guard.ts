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
    console.log("🔒 McpGuard: Validating request...")

    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    console.log("📋 Request details:", {
      url: request.url,
      method: request.method,
      hasAuthHeader: !!authHeader,
    })

    if (!authHeader) {
      console.log("❌ McpGuard: Missing Authorization header")
      throw new UnauthorizedException("Missing Authorization header")
    }

    const [type, token] = authHeader.split(" ")

    if (type !== "Bearer" || !token) {
      console.log("❌ McpGuard: Invalid format. Type:", type, "Has token:", !!token)
      throw new UnauthorizedException("Invalid Authorization header format. Expected: Bearer <token>")
    }

    const validToken = this.config.get<string>("MCP_ACCESS_TOKEN")
    console.log("🔑 Token comparison:")
    console.log("  Received:", token.substring(0, 10) + "...")
    console.log("  Expected:", validToken?.substring(0, 10) + "...")
    console.log("  Match:", token.trim() === validToken)

    if (token.trim() !== validToken) {
      console.log("❌ McpGuard: Invalid access token")
      throw new UnauthorizedException("Invalid access token")
    }

    console.log("✅ McpGuard: Authentication successful")
    return true
  }
}
