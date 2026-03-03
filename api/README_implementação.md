## Features

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

#### ApiKey

A chave pode ser gerada na rota `auth\apiKey` pode qualquer usuário autenticado.  
As rotas guardadas devem utilizar `@ApiKey()` e `@AllowAnonymous()`. Exemplo em `app.api.controller`.

```typescript
@ApiTags("ApiKey")
@Controller("api-key")
@ApiKey()
@AllowAnonymous()
@ApiHeader({ name: "x-api-key", description: "API key for authentication" })
export class AppApiKeyController {
  @Get("users")
  async getUsers(): Promise<PaginatedUserView> {
    throw new NotImplementedException();
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

### Cron Jobs

Configurar cron jobs em `api/src/cron.service.ts`

```typescript
  @Cron('30 21 * * *', { timeZone: 'America/Sao_Paulo' })
  handleCron() {
    this.logger.debug('Called every day at 21:30 America/Sao_Paulo')
  }
```

### Notification

Configurar notificações em `api/src/notifications`. As notificaçãoe utilizam `Queues` que podem ser gerenciadas.

## Implementação de Recursos

Instruções para criação de novo recurso (module, controller, service, dto). Utilize como exemplo o recurso de _ticker_ em `api/src/assets/tickers`.

- Executar o comando `nest g resource --no-spec` digitando o nome do recurso em inglês no plural.

### Service

- No `service` importar o prisma se necessário o uso do banco de dados.

```typescript
constructor(private prisma: PrismaService) { }
```

- Retornar receber como input preferencialmente a entidade do Prisma.
- Retornar preferencialmente a entidade do Prisma.
- Se retornar mais de um resultado, deve retornar também o _count_.

#### Erros Previstos

Alguns erros comuns que devem ser previstos

##### Unique

Casos que o registro possua um campo do tipo `unique` no banco de dados.

```typescript
  async create(data: CreateTickerInput): Promise<Ticker> {
    try {
      return await this.prisma.ticker.create(data)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(`Ticker with symbol ${data.symbol} already exists.`)
      } else {
        const err = error as Error

        this.logger.error(`Unexpected error while creating ticker, ${err.message}, ${data}`, err.stack)
        throw new InternalServerErrorException(`An unexpected error occurred while creating the ticker. Please try again later.`)
      }
    }
  }
```

#### Controller

- Deve fazer aplicar os dto de saída _view_.
- Caso o resultado seja um array deve retornar com a estrutura de paginação.
- Ajustar autenticação e autorização conforme necessário.
- Aplicar a documentação do Swagger.
- Utilizar utilitário para transformar entidades do Prisma em interfaces para os DTOs. Exemplo `api/src/assets/tickers/utils/index.ts`.

#### DTOs (view)

- Criar os DTOs de input sempre validando os dados com `ClassValidator`.
- Criar os DTOs de view omitindo os dados restritos.
- Criar os DTOs de view paginada sempre que necessário retornar um array.
- Criar os DTOs de query para os endpoints de busca conforme dados disponíveis do schema. Exemplo `api/src/assets/tickers/dto/query-ticker.input.ts`
- Aplicar a documentação do Swagger.

### Todo

- [x] Health Checker
- [x] Registro automático admin
- [x] Autenticação BetterAuth
  - [x] Email e Senha
  - [x] Google
  - [x] Roles
- [x] Autenticação API Key
- [x] CORS
- [x] Rate Limiting
- [x] Log Remoto
- [x] Cronjob
- [ ] Monitoramento de Cronjob
- [x] Queue
- [x] Monitoramento de Queue
- [ ] Monitoramento de Queue Socket
- [x] Padronização de Datas
- [ ] Notificação
  - [ ] Email
  - [ ] Whatsapp
  - [ ] Telegram

