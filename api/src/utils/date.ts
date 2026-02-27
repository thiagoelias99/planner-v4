import { format, startOfDay, endOfDay } from 'date-fns'
import {
  toZonedTime,
  fromZonedTime
} from 'date-fns-tz'

const BRAZIL_TZ = 'America/Sao_Paulo'

export class DateService {
  /**
   * Agora em UTC (para salvar no banco)
   */
  nowUtc(): Date {
    return new Date() // Node já cria em UTC internamente
  }

  /**
   * Agora no horário do Brasil
   */
  nowBrazil(): Date {
    return toZonedTime(new Date(), BRAZIL_TZ)
  }

  /**
   * Converte data do banco (UTC) para Brasil
   */
  toBrazil(date: Date): Date {
    return toZonedTime(date, BRAZIL_TZ)
  }

  /**
   * Converte data Brasil para UTC (para salvar no banco)
   */
  brazilToUtc(date: Date): Date {
    return fromZonedTime(date, BRAZIL_TZ)
  }

  /**
   * Início do dia no Brasil convertido para UTC
   */
  startOfDayBrazilToUtc(date: Date = new Date()): Date {
    const zoned = toZonedTime(date, BRAZIL_TZ)
    const start = startOfDay(zoned)
    return fromZonedTime(start, BRAZIL_TZ)
  }

  /**
   * Fim do dia no Brasil convertido para UTC
   */
  endOfDayBrazilToUtc(date: Date = new Date()): Date {
    const zoned = toZonedTime(date, BRAZIL_TZ)
    const end = endOfDay(zoned)
    return fromZonedTime(end, BRAZIL_TZ)
  }

  /**
   * Comparação segura (sempre UTC)
   */
  isAfterUtc(date1: Date, date2: Date): boolean {
    return date1.getTime() > date2.getTime()
  }

  /**
   * ISO UTC para API
   */
  toIsoUtc(date: Date): string {
    return date.toISOString()
  }

  /**
   * Formatar para exibição no Brasil
   */
  formatBrazil(date: Date, pattern = 'dd/MM/yyyy HH:mm'): string {
    const zoned = toZonedTime(date, BRAZIL_TZ)
    return format(zoned, pattern)
  }
}