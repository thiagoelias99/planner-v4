# Instruções para implementação do front end

### Tabelas

- Para a tabela criar um componente customizado da **web/src/components/tables/template/data-table.tsx** adaptando a exibição das colunas conforme necessidade. Exemplo **web/src/app/app/(protected)/admin/usuarios/\_components/users-table.tsx**
- Se necessário paginação, utilizar o componente **web/src/components/tables/template/data-table-pagination.tsx**. Sempre integrar como a biblioteca **nuqs** para melhor UX.
- Se necessário utilizar params de filtragem, busca, ordenação, criar um componente específico para isso. Sempre integrar como a biblioteca **nuqs** para melhor UX. Exemplo **web/src/app/app/(protected)/admin/usuarios/\_components/users-search.tsx**.
- Se necessário u=integrar um formulário de ação rápida, utilizar um componente "Sheet" na tabela, envolvendo o formulário.
- Exemplo de página **UsersPage** | **web/src/app/app/(protected)/admin/usuarios/page.tsx**.

### Formulários

- Criar um componente específico para cada formulário. Usar como exemplo o **CreateUsersForm** (_web/src/app/app/(protected)/admin/usuarios/\_components/create-users-form.tsx_) e **UpdateUsersForm** (_web/src/app/app/(protected)/admin/usuarios/\_components/update-users-form.tsx_).
- Utilizar preferencialmente os campos disponíveis na pasta **web/src/components/form**. Se necessário criar novos.
- Sempre validar os dados com a biblioteca zod. Na resposta do submit se houver erros enviados pela API devem ser tratados e mostrados no formulário e toast.
- Utilizar hook do reactQuery junto com authClient (axios) para comunicação com a API. Usar como exemplo o **useUsers** (_web/src/hooks/query/use-users.ts_) e **useUser** (_web/src/hooks/query/use-user.ts_).
- Após um submit com sucesso, sempre mostrar informações atualizadas, utilizando o **queryClient.invalidateQueries** se necessário.
