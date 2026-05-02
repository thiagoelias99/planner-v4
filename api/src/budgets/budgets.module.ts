import { Module } from "@nestjs/common"
import { BudgetsService } from "./budgets.service"
import { BudgetsController } from "./budgets.controller"
import { BudgetTool } from "./budgets.tool"
import { McpModule } from "@rekog/mcp-nest"

@Module({
  imports: [
    McpModule.forFeature([BudgetTool], "planner-mcp-server"),
  ],
  controllers: [BudgetsController],
  providers: [BudgetsService, BudgetTool],
  exports: [BudgetsService],
})
export class BudgetsModule { }
