# Instruções para implementação do front end

### Tabelas

- Para a tabela criar um componente customizado da **web/src/components/tables/template/data-table.tsx** adaptando a exibição das colunas conforme necessidade. Exemplo **web/src/app/app/(protected)/admin/usuarios/\_components/users-table.tsx**
- Se necessário paginação, utilizar o componente **web/src/components/tables/template/data-table-pagination.tsx**. Sempre integrar como a biblioteca **nuqs** para melhor UX.
- Se necessário utilizar params de filtragem, busca, ordenação, criar um componente específico para isso. Sempre integrar como a biblioteca **nuqs** para melhor UX. Exemplo **web/src/app/app/(protected)/admin/usuarios/\_components/users-search.tsx**.
- Se necessário u=integrar um formulário de ação rápida, utilizar um componente "Sheet" na tabela, envolvendo o formulário.
- Exemplo de página **UsersPage** | **web/src/app/app/(protected)/admin/usuarios/page.tsx**.

