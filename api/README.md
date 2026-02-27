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
- Cron jobs
- Queue

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

### Logger

- Opcionalmente pode ser utilizado o New Relic para salvar os logs remotamente.

```typescript
@Controller("health")
export class HealthController {
  private readonly logger = new CustomLogger("HealthController");

  @Get()
  @HealthCheck()
  check() {
    this.logger.log("Health check performed");

    // Rest...
  }
}
```

### Datas UTC

Utilitário `api/src/utils/date.ts`

#### Infraestrutura

- Servidor: UTC
- Banco: UTC
- Logs: UTC

#### Backend

- Tudo salvo em UTC
- Cron com America/Sao_Paulo
- Comparações sempre em UTC

#### Frontend

- Recebe ISO UTC
- Converte para local do usuário

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
- [x] Log Remoto
- [ ] Cronjob
- [ ] Queue
- [ ] Padronização de Datas

