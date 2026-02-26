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

#### Role

- `user` - Uso comum
- `admin` - Ações administrativas

```typescript
import { Controller, Get } from "@nestjs/common";
import { Roles } from "@thallesp/nestjs-better-auth";

@Controller("admin")
export class AdminController {
  @Roles(["admin"])
  @Get("dashboard")
  async adminDashboard() {
    // Only users with user.role = 'admin' can access
    // Organization admins CANNOT access this route
    return { message: "System admin dashboard" };
  }
}
```

### Todo

- [x] Health Checker
- [x] Registro automático admin
- [ ] Autenticação BetterAuth
  - [x] Email e Senha
  - [ ] Google
  - [x] Roles
- [ ] Autenticação API Key
- [x] CORS
- [x] Rate Limiting
- [ ] Log Remoto

