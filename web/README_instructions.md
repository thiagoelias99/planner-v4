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

---

## Modelos e Tipos

- Criar arquivo em **web/src/models/** com interfaces TypeScript correspondentes aos DTOs da API
- Incluir enums quando necessário (ex: tipos, status, roles)
- Criar mappers para tradução e estilização (ex: badges variants)
- Exemplo: **web/src/models/user.ts** e **web/src/models/ticker.ts**

```typescript
export interface IEntity {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum EEntityType {
  TYPE_A = "TYPE_A",
  TYPE_B = "TYPE_B",
}

export const eEntityTypeMapper: Record<
  EEntityType,
  { label: string; variant: "default" | "secondary" }
> = {
  [EEntityType.TYPE_A]: { label: "Tipo A", variant: "default" },
  [EEntityType.TYPE_B]: { label: "Tipo B", variant: "secondary" },
};
```

---

## Query Keys

- Adicionar chave no objeto **queriesKeys** em **web/src/lib/query-client.ts**
- Use nomes no singular para manter consistência

```typescript
export const queriesKeys = {
  users: "users",
  tickers: "tickers",
};
```

---

## Hooks React Query

- Criar dois hooks: um para listagem/criação (`use-entities.ts`) e outro para item individual (`use-entity.ts`)
- Hook de listagem deve incluir: `useQuery` para listar + `useMutation` para criar + mutações especiais (se houver)
- Hook individual deve incluir: `useQuery` para buscar + `useMutation` para atualizar/deletar
- Sempre usar `queryClient.invalidateQueries` no `onSuccess` das mutações
- Usar `keepPreviousData` para melhor UX durante paginação
- Exemplos: **web/src/hooks/query/use-users.ts**, **web/src/hooks/query/use-tickers.ts**

```typescript
export const useEntities = (params?: IQueryParams) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [queriesKeys.entities, params],
    queryFn: async () => {
      const response = await apiClient.get<IPaginatedData<IEntity>>(
        "/entities",
        { params },
      );
      return response.data;
    },
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });

  const createEntity = useMutation({
    mutationFn: async (data: ICreateInput) => {
      const response = await apiClient.post<IEntity>("/entities", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.entities] });
    },
  });

  return { ...query, createEntity };
};
```

---

## Formulários

- Criar um componente específico para cada formulário (create/update)
- Usar como exemplo **CreateUsersForm** e **UpdateUsersForm**
- Utilizar preferencialmente os campos disponíveis na pasta **web/src/components/form**
- Sempre validar os dados com a biblioteca **zod**
- Tratar erros da API e mostrar feedback via `toast` e `form.setError`
- Ao lidar com campos numéricos em inputs de texto, usar `z.string()` no schema e converter para number no submit
- Após sucesso, chamar callback `onSuccess` para fechar modais/sheets
- Exemplos: **web/src/app/app/(protected)/admin/usuarios/\_components/create-users-form.tsx**

```typescript
const formSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  price: z.string().optional(), // Para campos numéricos em inputs text
});

async function onSubmit(data: z.infer<typeof formSchema>) {
  try {
    const submitData = {
      ...data,
      price: data.price ? parseFloat(data.price) : undefined, // Converter para number
    };
    await createEntity.mutateAsync(submitData);
    form.reset();
    toast.success("Criado com sucesso!");
    if (onSuccess) onSuccess(data);
  } catch (error) {
    // Tratamento de erros específicos
    if (error instanceof AxiosError) {
      const messages = error?.response?.data?.message;
      const errorMessages = Array.isArray(messages)
        ? messages
        : [messages].filter(Boolean);

      if (errorMessages.some((msg) => msg.toLowerCase().includes("email"))) {
        form.setError("email", { message: "E-mail já está em uso" });
        return;
      }

      toast.error(errorMessages.join("\n"));
    }
  }
}
```

---

## Tabelas

- Criar um componente customizado da **web/src/components/tables/template/data-table.tsx** adaptando a exibição das colunas
- Usar Sheet integrado para ações rápidas de edição (não criar modal separado)
- Para badges de status/tipo, usar os mappers criados nos modelos
- Para formatação de valores (moeda, data), usar `Intl.NumberFormat` e `date-fns`
- Exemplo: **web/src/app/app/(protected)/admin/usuarios/\_components/users-table.tsx** e **tickers-table.tsx**

```typescript
// Exemplo de coluna com badge
{
  accessorKey: "type",
  header: () => <p className="text-center">Tipo</p>,
  cell: (row) => {
    const type = row.getValue() as EEntityType
    const typeInfo = eEntityTypeMapper[type]
    return (
      <div className="flex justify-center">
        <Badge variant={typeInfo.variant}>
          {typeInfo.label}
        </Badge>
      </div>
    )
  },
}

// Exemplo de coluna com formatação de moeda
{
  accessorKey: "price",
  header: () => <p className="text-end">Preço</p>,
  cell: (row) => {
    const price = row.getValue() as number
    return (
      <p className="text-end font-semibold">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
      </p>
    )
  },
}
```

---

## Paginação e Filtros

- Utilizar **data-table-pagination.tsx** para paginação
- Sempre integrar com a biblioteca **nuqs** para melhor UX e persistência na URL
- Criar componente de busca/filtros separado (ex: `entities-search.tsx`)
- Usar `useQueryStates` para gerenciar múltiplos params de URL
- Implementar `handleClearFilters` para resetar todos os filtros
- Implementar `hasActiveFilters` para mostrar botão de limpar apenas quando necessário
- Exemplo: **web/src/app/app/(protected)/admin/usuarios/\_components/users-search.tsx**

```typescript
const [params, setParams] = useQueryStates({
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(16),
  search: parseAsString.withDefault(""),
  type: parseAsString.withDefault("all"),
  orderBy: parseAsString.withDefault("name"),
  order: parseAsString.withDefault("asc")
})

// Converter "all" para undefined ao enviar para API
const { data } = useEntities({
  page: params.page,
  limit: params.limit,
  search: params.search || undefined,
  type: params.type !== "all" ? params.type : undefined,
  orderBy: params.orderBy,
  order: params.order
})

// Ao mudar filtro, resetar página para 1
onTypeChange={(value) => setParams({ type: value, page: 1 })}
```

---

## Página Principal

- Estrutura padrão: Container > Ações (Sheets/Botões) > Busca/Filtros > Tabela > Paginação
- Usar `useState` para controlar abertura/fechamento de Sheets
- Para ações especiais (auto-update, sync, etc), criar mutações específicas nos hooks
- Mostrar loading/disabled states durante mutações
- Exemplo: **web/src/app/app/(protected)/admin/usuarios/page.tsx** e **tickers/page.tsx**

```typescript
export default function EntitiesPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [params, setParams] = useQueryStates({ /* ... */ })

  const { data, specialAction } = useEntities(params)

  const handleSpecialAction = async () => {
    try {
      await specialAction.mutateAsync()
      toast.success("Ação executada com sucesso!")
    } catch (error) {
      toast.error("Erro ao executar ação")
    }
  }

  return (
    <Container>
      {/* Botões de ação */}
      <div className="flex gap-2 w-fit self-end">
        <Button onClick={handleSpecialAction} disabled={specialAction.isPending}>
          Ação Especial
        </Button>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button><PlusIcon /> Novo</Button>
          </SheetTrigger>
          {/* Sheet content */}
        </Sheet>
      </div>

      {/* Busca e filtros */}
      <EntitiesSearch {...searchProps} />

      {/* Tabela */}
      <EntitiesTable data={paginatedData.data} isLoading={!data} />

      {/* Paginação */}
      <DataTablePagination {...paginationProps} />
    </Container>
  )
}
```

---

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

---

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

