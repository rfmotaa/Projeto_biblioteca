/**
 * Utilitários de formatação para o dashboard de analytics
 */

/**
 * Formata um número para exibição com separadores de milhar
 * @param value - Número a ser formatado
 * @param locale - Locale para formatação (padrão: pt-BR)
 * @returns String formatada
 */
export function formatNumber(value: number, locale: string = 'pt-BR'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Formata um número como percentual
 * @param value - Valor decimal (ex: 0.75 para 75%)
 * @param decimals - Número de casas decimais (padrão: 1)
 * @param locale - Locale para formatação (padrão: pt-BR)
 * @returns String formatada com símbolo de %
 */
export function formatPercent(value: number, decimals: number = 1, locale: string = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Formata uma data para exibição
 * @param date - Data a ser formatada (string ou Date)
 * @param format - Formato desejado ('short', 'long', 'relative')
 * @param locale - Locale para formatação (padrão: pt-BR)
 * @returns String formatada
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'long' | 'relative' = 'short',
  locale: string = 'pt-BR'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Data inválida';
  }

  switch (format) {
    case 'short':
      return new Intl.DateFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(dateObj);

    case 'long':
      return new Intl.DateFormat(locale, {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(dateObj);

    case 'relative':
      return formatRelativeDate(dateObj, locale);

    default:
      return dateObj.toLocaleDateString(locale);
  }
}

/**
 * Formata uma data de forma relativa (ex: "hoje", "ontem", "há 2 dias")
 * @param date - Data a ser formatada
 * @param locale - Locale para formatação (padrão: pt-BR)
 * @returns String formatada
 */
export function formatRelativeDate(date: Date, locale: string = 'pt-BR'): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'hoje';
  } else if (diffInDays === 1) {
    return 'ontem';
  } else if (diffInDays === -1) {
    return 'amanhã';
  } else if (diffInDays < -1) {
    return `em ${Math.abs(diffInDays)} dias`;
  } else if (diffInDays < 7) {
    return `há ${diffInDays} dias`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `há ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `há ${years} ${years === 1 ? 'ano' : 'anos'}`;
  }
}

/**
 * Formata um número de semana e ano para exibição
 * @param semana - Número da semana (1-53)
 * @param ano - Ano
 * @returns String formatada (ex: "Semana 12 - 2024")
 */
export function formatSemanaAno(semana: number, ano: number): string {
  return `Semana ${semana} - ${ano}`;
}

/**
 * Formata um intervalo de semanas
 * @param dataInicio - Data de início
 * @param dataFim - Data de fim
 * @param locale - Locale para formatação (padrão: pt-BR)
 * @returns String formatada
 */
export function formatIntervalo(
  dataInicio: string | Date,
  dataFim: string | Date,
  locale: string = 'pt-BR'
): string {
  const inicio = typeof dataInicio === 'string' ? new Date(dataInicio) : dataInicio;
  const fim = typeof dataFim === 'string' ? new Date(dataFim) : dataFim;

  const formato = new Intl.DateFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return `${formato.format(inicio)} a ${formato.format(fim)}`;
}

/**
 * Arredonda um número para um número específico de casas decimais
 * @param value - Valor a ser arredondado
 * @param decimals - Número de casas decimais (padrão: 2)
 * @returns Número arredondado
 */
export function roundTo(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Formata um valor monetário
 * @param value - Valor a ser formatado
 * @param currency - Código da moeda (padrão: BRL)
 * @param locale - Locale para formatação (padrão: pt-BR)
 * @returns String formatada
 */
export function formatCurrency(
  value: number,
  currency: string = 'BRL',
  locale: string = 'pt-BR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Calcula o percentual de um valor em relação ao total
 * @param value - Valor parcial
 * @param total - Valor total
 * @param decimals - Casas decimais (padrão: 1)
 * @returns Percentual calculado
 */
export function calculatePercentage(value: number, total: number, decimals: number = 1): number {
  if (total === 0) return 0;
  return roundTo((value / total) * 100, decimals);
}

/**
 * Formata o tamanho de um arquivo em bytes para formato legível
 * @param bytes - Tamanho em bytes
 * @returns String formatada (ex: "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${roundTo(bytes / Math.pow(k, i), 2)} ${sizes[i]}`;
}

/**
 * Trunca um texto com reticências
 * @param text - Texto a ser truncado
 * @param maxLength - Comprimento máximo
 * @returns Texto truncado
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Formata o número de empréstimos com singular/plural
 * @param count - Número de empréstimos
 * @returns String formatada
 */
export function formatEmprestimosCount(count: number): string {
  return `${count} ${count === 1 ? 'empréstimo' : 'empréstimos'}`;
}
