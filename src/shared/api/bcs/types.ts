/** Позиция портфеля в ответе БКС (сервис «Портфель»). Только нужные поля. */
export interface BcsPosition {
  /** Тип позиции: moneyLimit | depoLimit | futuresLimit | futuresHolding | otcLimit */
  type: string
  /** ID субсчёта — часть идентификатора позиции (для дедупликации) */
  subAccountId: string
  /** Торговый счёт */
  account: string
  ticker: string
  displayName: string
  currency: string
  /** Верхнеуровневый тип: CURRENCY | RUSSIA | FOREIGN | OTC */
  upperType: string
  instrumentType: string
  quantity: number
  /** Текущая рыночная стоимость позиции в рублях */
  currentValueRub: number
  /** Балансовая (вложенная) стоимость позиции в рублях */
  balanceValueRub: number
  /** Прибыль/убыток по позиции, ₽ */
  unrealizedPL: number
  /** Дневное изменение стоимости позиции, ₽ */
  dailyPL: number
  /** Номинал (для облигаций) */
  faceValue: number
  /** Накопленный купонный доход (для облигаций) */
  accruedIncome: number
}

/**
 * Инструмент из справочника БКС (сервис «Информация», by-tickers).
 * Только поля, нужные для купонного календаря. Полная схема — в доке БКС.
 */
export interface BcsInstrument {
  ticker: string
  displayName: string
  /** Номинал */
  faceValue: number
  /** Количество купонов в год (12 — ежемесячно, 2 — раз в полгода) */
  couponsPerYear: number
  /** Ставка купона, % годовых от номинала */
  couponRate: number
  /** Дата ближайшей выплаты купона, ISO datetime */
  nextCoupon: string
  /**
   * Ближайшая дата погашения/оферты в формате YYYYMMDD.
   * Для бумаг с put-опционом БКС возвращает здесь дату оферты, а не легального
   * погашения; отдельного поля «оферта» в справочнике нет.
   */
  maturityDate: string
  /** Тип купона: «Постоянный» | «Переменный» */
  couponTypeName: string
  /** Валюта расчётов */
  settlementCurrency: string
}

/** Ответ авторизации Keycloak. */
export interface BcsTokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
  token_type: string
}
