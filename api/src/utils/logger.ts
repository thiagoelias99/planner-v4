import { LoggerService } from '@nestjs/common'
import newrelic from 'newrelic'

enum Color {
  Reset = '\x1b[0m',
  Green = '\x1b[32m',
  Yellow = '\x1b[33m',
  Red = '\x1b[31m',
  Magenta = '\x1b[35m',
  Cyan = '\x1b[36m',
  White = '\x1b[37m',
  Gray = '\x1b[90m',
}

export class CustomLogger implements LoggerService {
  private context?: string
  private isNewRelicEnabled: boolean

  constructor(context?: string) {
    this.context = context
    this.isNewRelicEnabled = process.env.NEW_RELIC_ENABLED === 'true'
  }

  private getTimestamp(): string {
    const now = new Date()
    return now.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  private formatMessage(
    message: any,
    level: string,
    color: Color,
    context?: string
  ): string {
    const timestamp = this.getTimestamp()
    const ctx = context || this.context
    const pid = process.pid

    const timestampStr = `${Color.Gray}[Nest] ${pid}  - ${Color.Reset}${timestamp}     `
    const levelStr = `${color}${level.toUpperCase().padEnd(7)}${Color.Reset}`
    const contextStr = ctx ? `${Color.Yellow}[${ctx}] ${Color.Reset}` : ''
    const messageStr = `${color}${message}${Color.Reset}`

    return `${timestampStr}${levelStr} ${contextStr}${messageStr}`
  }

  private sendToNewRelic(message: string, level: string, context?: string) {
    if (this.isNewRelicEnabled) {
      newrelic.recordLogEvent({
        message,
        level,
        context: context || this.context,
        timestamp: new Date().toISOString(),
      })
    }
  }

  log(message: any, context?: string) {
    const formattedMessage = this.formatMessage(message, 'log', Color.Green, context)
    console.log(formattedMessage)
    this.sendToNewRelic(message, 'info', context)
  }

  error(message: any, trace?: string, context?: string) {
    const formattedMessage = this.formatMessage(message, 'error', Color.Red, context)
    console.error(formattedMessage)
    if (trace) {
      console.error(`${Color.Red}${trace}${Color.Reset}`)
    }
    this.sendToNewRelic(
      trace ? `${message} - ${trace}` : message,
      'error',
      context
    )
  }

  warn(message: any, context?: string) {
    const formattedMessage = this.formatMessage(message, 'warn', Color.Yellow, context)
    console.warn(formattedMessage)
    this.sendToNewRelic(message, 'warn', context)
  }

  debug(message: any, context?: string) {
    const formattedMessage = this.formatMessage(message, 'debug', Color.Magenta, context)
    console.debug(formattedMessage)
    this.sendToNewRelic(message, 'debug', context)
  }

  verbose(message: any, context?: string) {
    const formattedMessage = this.formatMessage(message, 'verbose', Color.Cyan, context)
    console.log(formattedMessage)
    this.sendToNewRelic(message, 'verbose', context)
  }
}
