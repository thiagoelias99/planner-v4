### Features

- Prisma DB com Postgres
- Documentação Swagger
- Validação com ClassValidator e Validation Pipes
- Autenticação Better Auth
  - Email e Senha
  - Google
  - Roles
- Autenticação API Key
- Health Checker
- CORS
- Rate Limiting

### Autenticação com BetterAuth

Todas as rotas são bloqueadas por padrão, a menos que seja utilizado o `@AllowAnonymous()` ou `@OptionalAuth()`

#### Session

```typescript
import { Controller, Get } from "@nestjs/common";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

@Controller("users")
export class UserController {
  @Get("me")
  async getProfile(@Session() session: UserSession) {
    return session;
  }
}
```

### Todo

- [x] Health Checker
- [ ] Autenticação BetterAuth
- [ ] Autenticação API Key
- [x] CORS
- [x] Rate Limiting

