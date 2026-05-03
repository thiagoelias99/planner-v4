// Para rodar: npm run test:mcp
// Ou: node mcp-client-test.mjs

import 'dotenv/config'
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js"

async function main() {
  const userId = process.env.MCP_TEST_USER_ID // substitua pelo seu userId real
  console.log("🚀 Iniciando teste do MCP Client...")

  console.log("🔌 Conectando ao MCP server...")

  console.log("userId:", userId)

  const client = new Client(
    {
      name: "planner-test-client",
      version: "1.0.0"
    },
    {
      capabilities: {}
    }
  )

  console.log("🔌 Conectando ao MCP server...")

  await client.connect(
    new SSEClientTransport(new URL("http://localhost:3333/v1/sse"), {
      requestInit: {
        headers: {
          Authorization: `Bearer ${process.env.MCP_ACCESS_TOKEN}`,
        },
      }
    })
  )

  console.log("✅ Conectado com sucesso!\n")

  // List resources
  console.log("📚 Listando resources...")
  const resources = await client.listResources()
  console.log("Resources:", JSON.stringify(resources, null, 2))
  console.log()

  // Read a resource (categories)
  console.log("📖 Lendo resource de categorias...")
  try {
    const categories = await client.readResource({
      uri: `mcp://budget/categories/${userId}`
    })
    console.log("Categories:", JSON.stringify(categories, null, 2))
  } catch (error) {
    console.error("Erro ao ler categorias:", error.message)
  }
  console.log()

  // List tools
  console.log("🔧 Listando tools...")
  const tools = await client.listTools()
  console.log("Tools disponíveis:")
  tools.tools.forEach(tool => {
    console.log(`  - ${tool.name}: ${tool.description}`)
  })
  console.log()

  // Get transactions
  console.log("📊 Obtendo transações...")
  try {
    const transactionsResult = await client.callTool({
      name: "get-transactions",
      arguments: {
        userId
      }
    })
    console.log("Transactions:", JSON.stringify(transactionsResult, null, 2))
  } catch (error) {
    console.error("Erro ao obter transações:", error.message)
  }
  console.log()

  // Register transaction item
  console.log("💰 Registrando nova transação...")
  // try {
  //   const result = await client.callTool({
  //     name: "register-transaction-item",
  //     arguments: {
  //       userId,
  //       transactionId: "d3b8e0c6-9b7e-4c3a-bd8e-2f5b0c8e9d1f", // substitua por um ID válido
  //       date: "2026/05/02",
  //       value: "100.50",
  //       paymentMethod: "CREDIT_CARD"
  //     }
  //   })

  //   console.log("✅ Transação registrada:")
  //   console.log(JSON.stringify(result, null, 2))

  //   return result
  // } catch (error) {
  //   console.error("❌ Erro ao registrar transação:", error.message)
  //   throw error
  // }
}

main()
  .then((result) => {
    console.log("\n🎉 Teste concluído com sucesso!")
  })
  .catch((error) => {
    console.error("\n❌ Erro no teste:", error)
  })
  .finally(() => {
    process.exit(0)
  })
