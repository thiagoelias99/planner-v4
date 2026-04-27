require('dotenv').config()
const { Client } = require('pg')
const { createId } = require('@paralleldrive/cuid2')

const oldDb = new Client({
  connectionString: process.env.OLD_DB,
})
const oldUsersTable = 'users'

const newDb = new Client({
  connectionString: process.env.NEW_DB,
})
const newUsersTable = 'user'

async function buildUserMap() {
  // Selecionar todos os id e emails dos usuários antigos
  console.log('Selecionando usuários antigos...')
  const oldUsersQuery = `SELECT id, first_name, email FROM public.${oldUsersTable}`
  const { rows: oldUsers } = await oldDb.query(oldUsersQuery)

  console.log(`Usuários antigos encontrados: ${oldUsers.length}`)

  // Buscar o id por email na nova tabela e construir o mapeamento
  const userMap = {}
  console.log('Construindo UserMap...')
  for (const user of oldUsers) {
    const newUserQuery = `SELECT id FROM public.${newUsersTable} WHERE email = $1`
    const { rows: newUserRows } = await newDb.query(newUserQuery, [user.email])
    if (newUserRows.length > 0) {
      userMap[user.id] = newUserRows[0].id
      console.log(`Mapeado usuário: ${user.first_name} ${user.email} (old ID: ${user.id} -> new ID: ${newUserRows[0].id})`)
    } else {
      console.warn(`Usuário não encontrado: ${user.first_name} ${user.email} (old ID: ${user.id})`)
    }
  }

  return userMap
}

async function buildCategoryMap(oldUserId, newUserId) {
  console.log(`Construindo CategoryMap para usuário antigo ID ${oldUserId} -> novo ID ${newUserId}...`)
  console.log('Selecionando categorias do usuário antigo...')

  const oldCategories = await oldDb.query(`
    SELECT id, slug FROM public.transaction_categories WHERE user_id = $1
  `, [oldUserId])

  console.log(`Categorias encontradas para usuário antigo ID ${oldUserId}: ${oldCategories.rows.length}`)
  console.log('Construindo mapeamento de categorias...')
  const categoryMap = {}

  for (const category of oldCategories.rows) {
    const newCategoryQuery = `SELECT id FROM public.transaction_categories WHERE slug = $1 AND user_id = $2`
    const { rows: newCategoryRows } = await newDb.query(newCategoryQuery, [category.slug, newUserId])
    if (newCategoryRows.length > 0) {
      categoryMap[category.id] = newCategoryRows[0].id
      console.log(`Mapeado categoria: ${category.slug} (old ID: ${category.id} -> new ID: ${newCategoryRows[0].id})`)
    } else {
      console.warn(`Categoria não encontrada: ${category.slug} (old ID: ${category.id})`)
    }
  }
  return categoryMap
}

async function buildTransactionMap(oldUserId, newUserId) {
  console.log(`Construindo TransactionMap para usuário antigo ID ${oldUserId} -> novo ID ${newUserId}...`)
  console.log('Selecionando transações do usuário antigo...')

  const oldTransactions = await oldDb.query(`
    SELECT id, description, reference_value FROM public.transactions WHERE user_id = $1
  `, [oldUserId])

  console.log(`Transações encontradas para usuário antigo ID ${oldUserId}: ${oldTransactions.rows.length}`)
  console.log('Construindo mapeamento de transações...')
  const transactionMap = {}

  for (const transaction of oldTransactions.rows) {
    const newTransactionQuery = `SELECT id FROM public.transactions WHERE description = $1 AND user_id = $2 AND reference_value = $3`
    const { rows: newTransactionRows } = await newDb.query(newTransactionQuery, [transaction.description, newUserId, transaction.reference_value])
    if (newTransactionRows.length > 0) {
      transactionMap[transaction.id] = newTransactionRows[0].id
      console.log(`Mapeado transação: ${transaction.description} (old ID: ${transaction.id} -> new ID: ${newTransactionRows[0].id})`)
    } else {
      console.warn(`Transação não encontrada: ${transaction.description} (old ID: ${transaction.id})`)
    }
  }
  return transactionMap
}

async function migrateTableCategories(oldUserId, newUserId) {
  console.log(`Migrando categorias para usuário antigo ID ${oldUserId} -> novo ID ${newUserId}...`)

  // Selecionar categorias do usuário antigo
  const oldCategoriesQuery = `SELECT * FROM public.transaction_categories WHERE user_id = $1`
  const { rows: oldCategories } = await oldDb.query(oldCategoriesQuery, [oldUserId])
  console.log(`Categorias encontradas para usuário antigo ID ${oldUserId}: ${oldCategories.length}`)

  for (const category of oldCategories) {
    const newCategory = { ...category, user_id: newUserId, id: createId() }

    const keys = Object.keys(newCategory)
    const values = Object.values(newCategory)

    const placeholders = keys.map((_, i) => `$${i + 1}`).join(',')

    const query = `
      INSERT INTO public.transaction_categories (${keys.join(',')})
      VALUES (${placeholders})
      ON CONFLICT DO NOTHING
    `

    try {
      await newDb.query(query, values)
    } catch (err) {
      console.error(`Erro ao inserir em transaction_categories:`, err.message)
    }
  }
}

async function migrateTableTransactions(oldUserId, newUserId, categoryMap) {
  console.log(`Migrando transações para usuário antigo ID ${oldUserId} -> novo ID ${newUserId}...`)

  // Selecionar transações do usuário antigo
  const oldTransactionsQuery = `SELECT * FROM public.transactions WHERE user_id = $1`
  const { rows: oldTransactions } = await oldDb.query(oldTransactionsQuery, [oldUserId])
  console.log(`Transações encontradas para usuário antigo ID ${oldUserId}: ${oldTransactions.length}`)

  for (const transaction of oldTransactions) {
    const newTransaction = { ...transaction, user_id: newUserId, id: createId() }

    // console.log(`Processando transação ID ${transaction.id} para usuário antigo ID ${oldUserId} -> novo ID ${newUserId}...`)
    // console.log(`Dados da transação ID ${transaction.id}:`, transaction)

    // Mapear category_id usando o categoryMap
    if (transaction.categoryId) {
      // console.log(`Mapeando category_id para transação ID ${transaction.id}: old category ID ${transaction.categoryId} -> new category ID ${categoryMap[transaction.categoryId]}`)
      newTransaction.categoryId = categoryMap[transaction.categoryId]
    }

    const keys = Object.keys(newTransaction)
    const values = Object.values(newTransaction)

    // const placeholders = keys.map((_, i) => `$${i + 1}`).join(',')

    // const query = `
    //   INSERT INTO public.transactions (${keys.join(',')})
    //   VALUES (${placeholders})
    //   ON CONFLICT DO NOTHING
    // `

    const query = `
      INSERT INTO public.transactions (id,user_id,description,reference_value,payment_method,category_id,freq,interval,count,start_date,until,by_day,by_month_day,by_month,active,image_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      ON CONFLICT DO NOTHING
    `

    try {
      // console.log(`Inserindo transação ID ${transaction.id} para usuário antigo ID ${oldUserId} -> novo ID ${newUserId}...`)
      await newDb.query(query, values)
    } catch (err) {
      console.error(`Erro ao inserir em transactions:`, err.message)
    }
  }
}

async function migrateTableTransactionItems(oldUserId, newUserId, transactionMap) {
  console.log(`Migrando transações itens para usuário antigo ID ${oldUserId} -> novo ID ${newUserId}...`)

  // Selecionar transações do usuário antigo
  const oldTransactionsQuery = `SELECT * FROM public.transaction_items WHERE user_id = $1`
  const { rows: oldTransactionsItems } = await oldDb.query(oldTransactionsQuery, [oldUserId])
  console.log(`Transações encontradas para usuário antigo ID ${oldUserId}: ${oldTransactionsItems.length}`)

  for (const item of oldTransactionsItems) {
    const newItem = { ...item, user_id: newUserId, id: createId() }

    // console.log(`Processando transação ID ${transaction.id} para usuário antigo ID ${oldUserId} -> novo ID ${newUserId}...`)
    // console.log(`Dados da transação ID ${transaction.id}:`, transaction)

    // Mapear transaction_id usando o transactionMap
    if (item.transaction_id) {
      newItem.transaction_id = transactionMap[item.transaction_id]
    }

    const keys = Object.keys(newItem)
    const values = Object.values(newItem)

    // const placeholders = keys.map((_, i) => `$${i + 1}`).join(',')

    // const query = `
    //   INSERT INTO public.transactions (${keys.join(',')})
    //   VALUES (${placeholders})
    //   ON CONFLICT DO NOTHING
    // `

    const query = `
      INSERT INTO public.transaction_items (id,user_id,transaction_id,payment_method,date,value,active)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT DO NOTHING
    `

    try {
      // console.log(`Inserindo transação ID ${transaction.id} para usuário antigo ID ${oldUserId} -> novo ID ${newUserId}...`)
      await newDb.query(query, values)
    } catch (err) {
      console.error(`Erro ao inserir em transaction_items:`, err.message)
    }
  }
}

async function main() {
  try {
    console.log('Iniciando migração das tabelas...')

    // Conectar aos bancos de dados
    console.log('Conectando aos bancos de dados...')
    console.log('Old DB URL:', process.env.OLD_DB)
    await oldDb.connect()
    console.log('New DB URL:', process.env.NEW_DB)
    await newDb.connect()

    // Construir UserMap
    console.log('Construindo UserMap...')
    const userMap = await buildUserMap()
    console.log('UserMap:', userMap)

    // Para cada usuario, fazer a migração dos dados relacionados, utilizando o userMap para mapear os IDs antigos para os novos
    for (const oldUserId in userMap) {
      const newUserId = userMap[oldUserId]
      await migrateTableCategories(oldUserId, newUserId)

      console.log('Construindo CategoryMap para usuário antigo ID', oldUserId)
      const categoryMap = await buildCategoryMap(oldUserId, newUserId)

      await migrateTableTransactions(oldUserId, newUserId, categoryMap)

      console.log('Construindo TransactionMap para usuário antigo ID', oldUserId)
      const transactionMap = await buildTransactionMap(oldUserId, newUserId)

      await migrateTableTransactionItems(oldUserId, newUserId, transactionMap)
    }

  } catch (error) {
    console.error('Erro durante a migração:', error)
  } finally {
    await oldDb.end()
    await newDb.end()
  }
}






main()