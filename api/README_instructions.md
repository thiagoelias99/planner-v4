# Implementação de Recursos API

Instruções para criação de novo recurso (module, controller, service, dto). Utilize como exemplo o recurso de _ticker_ em `api/src/assets/tickers` e _ticker-orders_ em `api/src/assets/ticker-orders`.

---

## Ordem de Implementação

Ao criar uma nova funcionalidade CRUD na API, seguir esta ordem:

1. **Schema Prisma** → Criar/atualizar model em `api/prisma/schema.prisma` e rodar migration
2. **Gerar Recurso** → Executar `nest g resource --no-spec` (plural em inglês)
3. **DTOs** → Criar DTOs de input, update, query e view em `dto/`
4. **Utilitários** → Criar função de transformação Prisma → DTO em `utils/index.ts`
5. **Service** → Implementar lógica de negócio e acesso ao banco
6. **Controller** → Criar endpoints REST com validação e documentação Swagger
7. **Module** → Configurar imports (PrismaModule) e registrar no AppModule
8. **Testes** → Validar endpoints e tratamento de erros

## Schema Prisma

- Definir o model em **api/prisma/schema.prisma**
- Usar naming conventions: snake_case para colunas do banco, camelCase no Prisma
- Usar `@map()` para mapear nomes de colunas, `@@map()` para nome de tabelas
- Definir índices com `@@index()` para campos frequentemente consultados
- Criar migration: `npx prisma migrate dev --name create_resource_name`
- Exemplo: modelo **Ticker** e **TickerOrder**

## DTOs (Data Transfer Objects)

### Create Input DTO

- Criar em **dto/create-resource.input.ts**
- Usar decorators do `class-validator` para validação
- Usar decorators do `@nestjs/swagger` para documentação
- Validar tipos de dados, tamanhos, formatos e regras de negócio
- Exemplo: **api/src/assets/ticker-orders/dto/create-ticker-order.input.ts**

### Update Input DTO

- Criar em **dto/update-resource.input.ts**
- Usar `PartialType` para tornar todos os campos opcionais
- Usar `OmitType` para remover campos que não podem ser atualizados (ex: IDs únicos)
- Exemplo: **api/src/assets/tickers/dto/update-ticker.input.ts**

### Query Input DTO

- Criar em **dto/query-resource.input.ts**
- Incluir paginação: `page`, `limit` (com defaults)
- Incluir ordenação: `orderBy`, `order` (asc/desc)
- Incluir filtros específicos do recurso
- Usar `@Type()` do `class-transformer` para conversão de tipos
- Exemplo: **api/src/assets/ticker-orders/dto/query-ticker-order.input.ts**

### View DTO

- Criar em **dto/resource.view.ts**
- Incluir apenas campos que devem ser expostos na API (omitir dados sensíveis)
- Converter tipos do Prisma para tipos JavaScript (ex: `Decimal` → `number`)
- Usar `ApiProperty` para documentação Swagger
- Criar classe de paginação para listagens
- Exemplo: **api/src/assets/ticker-orders/dto/ticker-orders.view.ts**

## Utilitários (Utils)

- Criar em **utils/index.ts**
- Implementar função de transformação: Prisma Entity → View DTO
- Converter tipos especiais: `Decimal` → `number`, `Date` → `Date`
- Aplicar regras de negócio de apresentação (defaults, formatações)
- Exemplo: **api/src/assets/ticker-orders/utils/index.ts**

## Service

### Estrutura Básica

- Injetar o `PrismaService` no constructor
- Criar instância de `CustomLogger` para logging
- Implementar métodos CRUD: `create`, `findAll`, `findOne`, `update`, `remove`
- Sempre retornar entidades do Prisma (não DTOs)
- Em listagens, retornar `{ items: Entity[], total: number }`
- Exemplo: **api/src/assets/ticker-orders/ticker-orders.service.ts**

### Método Create

- Validar dados de entrada e relações (ex: FK existem?)
- Usar `try-catch` para tratamento de erros
- Capturar erros conhecidos do Prisma (`PrismaClientKnownRequestError`)
- Lançar exceções específicas: `BadRequestException`, `NotFoundException`
- Sempre logar erros inesperados com contexto completo
- Exemplo:

### Método FindAll (Listagem com Paginação)

- Construir `where` clause baseado nos filtros
- Usar `$transaction` para buscar dados e count em paralelo
- Implementar paginação: `skip = (page - 1) * limit`
- Implementar ordenação dinâmica
- Suportar busca textual com `contains` (case insensitive)
- Exemplo:

### Método FindOne

- Validar se o recurso existe
- Lançar `NotFoundException` se não encontrado
- Exemplo:

### Método Update

- Primeiro verificar se o recurso existe (chamar `findOne`)
- Validar mudanças em relações se necessário
- Tratar erros conhecidos
- Exemplo:

### Método Remove (Delete)

- Verificar se o recurso existe antes de deletar
- Considerar soft delete se necessário
- Exemplo:

### Códigos de Erro Prisma Comuns

- `P2002`: Violação de constraint UNIQUE
- `P2003`: Violação de constraint FK (relação não existe)
- `P2025`: Registro não encontrado para atualização/deleção
- Documentação completa: https://www.prisma.io/docs/reference/api-reference/error-reference

## Controller

### Estrutura Básica

- Injetar o Service no constructor
- Usar decorators do NestJS: `@Controller`, `@Get`, `@Post`, `@Put`, `@Delete`
- Usar `@ApiTags` para agrupar endpoints no Swagger
- Sempre transformar entidades Prisma em DTOs de View antes de retornar
- Exemplo: **api/src/assets/ticker-orders/ticker-orders.controller.ts**

### Endpoint Create (POST)

- Usar `@Post()` sem parâmetros
- Validar body com DTO de input
- Retornar status 201 (padrão do POST)
- Transformar entidade em View DTO
- Documentar com `@ApiCreatedResponse`

### Endpoint FindAll (GET Lista)

- Usar `@Get()` sem parâmetros
- Receber query params com DTO de query
- Retornar estrutura paginada
- Mapear array de entidades para array de Views
- Documentar com `@ApiOkResponse`

### Endpoint FindOne (GET por ID)

- Usar `@Get(':id')` com parâmetro de rota
- Validar se recurso existe (service lança NotFoundException)
- Transformar entidade em View DTO

### Endpoint Update (PUT)

- Usar `@Put(':id')` com parâmetro de rota
- Validar body com DTO de update
- Retornar entidade atualizada como View

### Endpoint Delete (DELETE)

- Usar `@Delete(':id')` com parâmetro de rota
- Usar `@HttpCode(204)` para retornar No Content
- Não retornar body (void)
- Documentar com `@ApiNoContentResponse`

### Autenticação e Autorização

- Usar `@Roles(['admin'])` para proteger endpoints específicos (do pacote `@thallesp/nestjs-better-auth`)
- Guards globais (ApiKey, Throttler) são aplicados automaticamente
- Usar `@AllowAnonymous()` se necessário criar endpoint público

## Module

- Criar em **resource.module.ts** (gerado automaticamente pelo NestJS CLI)
- Importar `PrismaModule` nos imports
- Registrar Controller e Service
- Exemplo: **api/src/assets/ticker-orders/ticker-orders.module.ts**

### Registrar no AppModule

- Adicionar o novo módulo em **api/src/app.module.ts**
- Importar na lista de imports

## Convenções de Nomenclatura

### Arquivos e Pastas

- **Pasta do recurso**: `resources/` (plural, kebab-case) - ex: `ticker-orders/`
- **Module**: `resource.module.ts` - ex: `ticker-orders.module.ts`
- **Controller**: `resource.controller.ts` - ex: `ticker-orders.controller.ts`
- **Service**: `resource.service.ts` - ex: `ticker-orders.service.ts`
- **DTOs**:
  - Create: `create-resource.input.ts`
  - Update: `update-resource.input.ts`
  - Query: `query-resource.input.ts`
  - View: `resource.view.ts`
- **Utils**: `utils/index.ts`

### Classes e Interfaces

- **Entities**: PascalCase singular - `TickerOrder` (do Prisma)
- **DTOs**: PascalCase com sufixo - `CreateTickerOrderInput`, `TickerOrderView`
- **Services**: PascalCase com sufixo - `TickerOrdersService`
- **Controllers**: PascalCase com sufixo - `TickerOrdersController`
- **Interfaces**: prefixo `I` - `ITickerOrderView`
- **Enums**: prefixo `E` - `ETickerOrderType`

### Métodos

- **Service**: `create`, `findAll`, `findOne`, `update`, `remove`
- **Controller**: `create`, `findAll`, `findOne`, `update`, `remove`
- **Utils**: `prisma{Entity}To{Entity}View` - ex: `prismaTickerOrderToTickerOrderView`

### Rotas

- Usar kebab-case - `/ticker-orders`
- Padrão REST:
  - `POST /resources` - criar
  - `GET /resources` - listar
  - `GET /resources/:id` - buscar um
  - `PUT /resources/:id` - atualizar
  - `DELETE /resources/:id` - deletar

---

## Boas Práticas

- ✅ Sempre validar dados de entrada com `class-validator`
- ✅ Sempre documentar endpoints com decorators do Swagger
- ✅ Usar entidades do Prisma internamente, DTOs na interface HTTP
- ✅ Tratar erros conhecidos do Prisma (P2002, P2003, P2025)
- ✅ Sempre logar erros inesperados com contexto completo
- ✅ Lançar exceções apropriadas: `BadRequestException`, `NotFoundException`, `InternalServerErrorException`
- ✅ Implementar paginação em listagens com defaults sensatos (page=1, limit=10)
- ✅ Usar `$transaction` para operações que precisam de consistência
- ✅ Validar relações (FKs) antes de criar/atualizar
- ✅ Converter tipos especiais do Prisma (`Decimal` → `number`)
- ✅ Usar `@Type()` em DTOs de query para conversão automática de tipos
- ✅ Implementar soft delete quando apropriado (campo `deletedAt`)
- ✅ Usar índices no banco para campos frequentemente filtrados
- ✅ Exportar Services no Module se outros módulos precisarem usar
- ✅ Manter secrets e configs em variáveis de ambiente (`.env`)
- ✅ Usar guards para autenticação/autorização quando necessário
- ✅ Retornar status HTTP apropriados (201 para create, 204 para delete)
- ✅ Implementar rate limiting para endpoints sensíveis
- ✅ Validar e sanitizar inputs para prevenir SQL injection e XSS

---

## Checklist de Implementação

Ao implementar um novo recurso, verificar:

- [ ] Schema Prisma criado com índices apropriados
- [ ] Migration executada com sucesso
- [ ] DTOs criados (create, update, query, view, paginated view)
- [ ] Validações aplicadas nos DTOs de input
- [ ] Enums criados se necessário
- [ ] Função utilitária de transformação criada
- [ ] Service implementado com todos os métodos CRUD
- [ ] Tratamento de erros implementado no Service
- [ ] Logger configurado no Service
- [ ] Controller implementado com todos os endpoints
- [ ] Swagger documentado em todos os endpoints
- [ ] DTOs de View aplicados em todas as respostas
- [ ] Module configurado com imports corretos
- [ ] Module registrado no AppModule
- [ ] Guards de autenticação/autorização aplicados se necessário
- [ ] Testado manualmente todos os endpoints
- [ ] Validado tratamento de erros (casos de sucesso e falha)

