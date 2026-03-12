# Instruções para implementação do front end

## Ordem de Implementação

Ao criar uma nova funcionalidade CRUD, seguir esta ordem:

1. **Tipos e Modelos** → Criar interfaces em `web/src/models/`
2. **Query Keys** → Adicionar chave em `web/src/lib/query-client.ts`
3. **Hooks React Query** → Criar hooks customizados em `web/src/hooks/query/`
4. **Componentes de Formulário** → Criar forms em `_components/`
5. **Componente de Tabela** → Criar tabela em `_components/`
6. **Componente de Busca/Filtros** → Criar search em `_components/`
7. **Página Principal** → Montar tudo em `page.tsx`

## Modelos e Tipos

- Criar arquivo em **web/src/models/** com interfaces TypeScript correspondentes aos DTOs da API
- Incluir enums quando necessário (ex: tipos, status, roles)
- Criar mappers para tradução e estilização (ex: badges variants)
- Exemplo: **web/src/models/user.ts** e **web/src/models/ticker.ts**

## Query Keys

- Adicionar chave no objeto **queriesKeys** em **web/src/lib/query-client.ts**
- Use nomes no singular para manter consistência

## Hooks React Query

- Criar dois hooks: um para listagem/criação (`use-entities.ts`) e outro para item individual (`use-entity.ts`)
- Hook de listagem deve incluir: `useQuery` para listar + `useMutation` para criar + mutações especiais (se houver)
- Hook individual deve incluir: `useQuery` para buscar + `useMutation` para atualizar/deletar
- Sempre usar `queryClient.invalidateQueries` no `onSuccess` das mutações
- Usar `keepPreviousData` para melhor UX durante paginação
- Exemplos: **web/src/hooks/query/use-users.ts**, **web/src/hooks/query/use-tickers.ts**

## Formulários

- Criar um componente específico para cada formulário (create/update)
- Usar como exemplo **CreateUsersForm** e **UpdateUsersForm**
- Utilizar preferencialmente os campos disponíveis na pasta **web/src/components/form**
- Sempre validar os dados com a biblioteca **zod**
- Tratar erros da API e mostrar feedback via `toast` e `form.setError`
- Ao lidar com campos numéricos em inputs de texto, usar `z.string()` no schema e converter para number no submit
- Após sucesso, chamar callback `onSuccess` para fechar modais/sheets
- Exemplos: **web/src/app/app/(protected)/admin/usuarios/\_components/create-users-form.tsx**

### Campos disponíveis

Todos os componentes estão localizados em **web/src/components/form**. Os arquivos dos componentes podem ter observações adicionais inclusas.

- **FormBody** - Utilizar como layout principal do formulário. Adiciona spacing adequado entre campos.

- **FormInput** - Input de texto genérico. Suporta diferentes tipos: `text`, `email`, `password`, `tel`, `url`. Props opcionais: `placeholder`, `description`, `autoComplete`, `disabled`, `required`.

- **FormNumberInput** - Input para números. Converte automaticamente para `Number`. Props opcionais: `step`, `min`, `max`, `placeholder`, `description`, `disabled`, `required`.

- **FormCurrencyInput** - Input para valores monetários. **Importante**: No schema Zod usar `z.string()` e validar com `refine`. No `onSubmit` converter usando `parseFloat(data.field.replace(",", "."))`. Props opcionais: `currency`, `step`, `min`, `max`, `placeholder`, `description`, `disabled`, `required`. Consultar comentários no arquivo para exemplos de validação.

- **FormPercentageInput** - Input para porcentagem com símbolo %. **Importante**: No schema Zod usar `z.string()` e validar com `refine`. No `onSubmit` converter usando `parseFloat(data.field.replace(",", "."))`. Props opcionais: `step`, `min`, `max`, `placeholder`, `description`, `disabled`, `required`, `className`. Consultar comentários no arquivo para exemplos de validação.

- **FormDateInput** - Input para datas. Suporta diferentes modos: `datetime`, `date`, `time`, `month`. Formata automaticamente o valor. Props opcionais: `mode`, `min`, `max`, `placeholder`, `description`, `disabled`, `required`.

- **FormSelect** - Select dropdown. Requer prop `options` com array de `{label: string, value: string}`. Props opcionais: `placeholder`, `description`, `orientation` (vertical/horizontal/responsive), `minWidth`, `disabled`, `required`.

- **FormSwitch** - Switch/toggle boolean. Renderiza em layout horizontal com label e descrição à esquerda. Props opcionais: `description`, `disabled`, `required`.

- **FormTextarea** - Área de texto para conteúdo longo. Props opcionais: `minHeight`, `placeholder`, `description`, `disabled`, `required`.

- **FormColorInput** - Seletor de cor. Renderiza input de texto (para código hex) e color picker lado a lado. Props opcionais: `placeholder`, `description`, `disabled`, `required`.

## Tabelas

- Criar um componente customizado da **web/src/components/tables/template/data-table.tsx** adaptando a exibição das colunas
- Usar Sheet integrado para ações rápidas de edição (não criar modal separado)
- Para badges de status/tipo, usar os mappers criados nos modelos
- Para formatação de valores (moeda, data), usar `Intl.NumberFormat` e `date-fns`
- Exemplo: **web/src/app/app/(protected)/admin/usuarios/\_components/users-table.tsx** e **tickers-table.tsx**

## Paginação e Filtros

- Utilizar **data-table-pagination.tsx** para paginação
- Sempre integrar com a biblioteca **nuqs** para melhor UX e persistência na URL
- Criar componente de busca/filtros separado (ex: `entities-search.tsx`)
- Usar `useQueryStates` para gerenciar múltiplos params de URL
- Implementar `handleClearFilters` para resetar todos os filtros
- Implementar `hasActiveFilters` para mostrar botão de limpar apenas quando necessário
- Exemplo: **web/src/app/app/(protected)/admin/usuarios/\_components/users-search.tsx**

## Página Principal

- Estrutura padrão: Container > Ações (Sheets/Botões) > Busca/Filtros > Tabela > Paginação
- Usar `useState` para controlar abertura/fechamento de Sheets
- Para ações especiais (auto-update, sync, etc), criar mutações específicas nos hooks
- Mostrar loading/disabled states durante mutações
- Exemplo: **web/src/app/app/(protected)/admin/usuarios/page.tsx** e **tickers/page.tsx**

## Convenções de Nomenclatura

- **Modelos**: `entity.ts` (singular)
- **Hooks**: `use-entities.ts` (listagem, plural) e `use-entity.ts` (individual, singular)
- **Componentes**:
  - Tabela: `entities-table.tsx`
  - Busca: `entities-search.tsx`
  - Forms: `create-entities-form.tsx` e `update-entities-form.tsx`
- **Pasta de components**: `_components/` (com underscore)
- **Interfaces**: prefixo `I` (ex: `IEntity`)
- **Enums**: prefixo `E` (ex: `EEntityType`)
- **Mappers de enum**: sufixo `Mapper` (ex: `eEntityTypeMapper`)

## Boas Práticas

- ✅ Sempre usar `"use client"` no topo dos componentes React com hooks
- ✅ Validar formulários com Zod antes de enviar para API
- ✅ Tratar erros específicos e mostrar feedback claro ao usuário
- ✅ Invalidar queries após mutações para manter dados sincronizados
- ✅ Usar `keepPreviousData` em queries paginadas
- ✅ Converter valores de filtros "all" para `undefined` antes de enviar para API
- ✅ Resetar página para 1 ao mudar filtros
- ✅ Usar badges com variants consistentes para status/tipos
- ✅ Formatar valores monetários e datas de forma localizada
- ✅ Implementar loading/disabled states durante operações assíncronas

