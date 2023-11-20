export function pmt(presentValue: number, rate: number, periods: number) {
  return (presentValue * rate * Math.pow(1 + rate, periods)) / (Math.pow(1 + rate, periods) - 1)
}

export function fv(presentValue: number, rate: number, periods: number, period: number) {
  return (
    (presentValue * (Math.pow(1 + rate, periods) - Math.pow(1 + rate, period))) /
    (Math.pow(1 + rate, periods) - 1)
  )
}

export function rate(presentValue: number, finalValue: number, periods: number) {
  return Math.pow(finalValue / presentValue, 1 / periods) - 1
}

export function appreciationValue(presentValue: number, rate: number, periods: number) {
  return presentValue * Math.pow(1 + rate, periods)
}

export function parseNumber(string: number) {
  if (string instanceof Error) {
    return string
  }

  if (string === undefined || string === null) {
    return 0
  }

  if (typeof string === 'boolean') {
    string = +string
  }

  if (!isNaN(string) && string !== '') {
    return parseFloat(string)
  }

  return error.value
}

export function anyIsError(..._: number[]) {
  let n = arguments.length

  while (n--) {
    if (arguments[n] instanceof Error) {
      return true
    }
  }

  return false
}

const utils = { parseNumber, anyIsError }

const error = {
  nil: new Error('#NULL!'),
  div0: new Error('#DIV/0!'),
  value: new Error('#VALUE!'),
  ref: new Error('#REF!'),
  name: new Error('#NAME?'),
  num: new Error('#NUM!'),
  na: new Error('#N/A'),
  error: new Error('#ERROR!'),
  data: new Error('#GETTING_DATA'),
}

/**
 * Returns the future value of an investment.
 *
 * Category: Financial
 *
 * @param {*} rate The interest rate per period.
 * @param {*} nper The total number of payment periods in an annuity.
 * @param {*} pmt The payment made each period; it cannot change over the life of the annuity. Typically, pmt contains principal and interest but no other fees or taxes. If pmt is omitted, you must include the pv argument.
 * @param {*} pv Optional. The present value, or the lump-sum amount that a series of future payments is worth right now. If pv is omitted, it is assumed to be 0 (zero), and you must include the pmt argument.
 * @param {*} type Optional. The number 0 or 1 and indicates when payments are due. If type is omitted, it is assumed to be 0.
 * @returns
 */
export function FV(
  rate: number,
  nper: number,
  payment: number,
  value: number = 0,
  type: number = 0,
) {
  // Credits: algorithm inspired by Apache OpenOffice
  value = value || 0
  type = type || 0

  rate = utils.parseNumber(rate)
  nper = utils.parseNumber(nper)
  payment = utils.parseNumber(payment)
  value = utils.parseNumber(value)
  type = utils.parseNumber(type)

  if (utils.anyIsError(rate, nper, payment, value, type)) {
    return error.value
  }

  // Return future value
  let result

  if (rate === 0) {
    result = value + payment * nper
  } else {
    const term = Math.pow(1 + rate, nper)

    result =
      type === 1
        ? value * term + (payment * (1 + rate) * (term - 1)) / rate
        : value * term + (payment * (term - 1)) / rate
  }

  return -result
}

/**
 * Returns the periodic payment for an annuity.
 *
 * Category: Financial
 *
 * @param {*} rate The interest rate for the loan.
 * @param {*} nper The total number of payments for the loan.
 * @param {*} pv The present value, or the total amount that a series of future payments is worth now; also known as the principal.
 * @param {*} fv Optional. The future value, or a cash balance you want to attain after the last payment is made. If fv is omitted, it is assumed to be 0 (zero), that is, the future value of a loan is 0.
 * @param {*} type Optional. The number 0 (zero) or 1 and indicates when payments are due.
 * @returns
 */
export function PMT(rate: number, nper: number, pv: number, fv: number = 0, type: number = 0) {
  // Credits: algorithm inspired by Apache OpenOffice
  fv = fv || 0
  type = type || 0

  rate = utils.parseNumber(rate)
  nper = utils.parseNumber(nper)
  pv = utils.parseNumber(pv)
  fv = utils.parseNumber(fv)
  type = utils.parseNumber(type)

  if (utils.anyIsError(rate, nper, pv, fv, type)) {
    return error.value
  }

  // Return payment
  let result

  if (rate === 0) {
    result = (pv + fv) / nper
  } else {
    const term = Math.pow(1 + rate, nper)

    result =
      type === 1
        ? ((fv * rate) / (term - 1) + (pv * rate) / (1 - 1 / term)) / (1 + rate)
        : (fv * rate) / (term - 1) + (pv * rate) / (1 - 1 / term)
  }

  return -result
}

/**
 * Returns the interest payment for an investment for a given period.
 *
 * Category: Financial
 *
 * @param {*} rate The interest rate per period.
 * @param {*} per The period for which you want to find the interest and must be in the range 1 to nper.
 * @param {*} nper The total number of payment periods in an annuity.
 * @param {*} pv The present value, or the lump-sum amount that a series of future payments is worth right now.
 * @param {*} fv Optional. The future value, or a cash balance you want to attain after the last payment is made. If fv is omitted, it is assumed to be 0 (the future value of a loan, for example, is 0).
 * @param {*} type Optional. The number 0 or 1 and indicates when payments are due. If type is omitted, it is assumed to be 0.
 * @returns
 */
export function IPMT(
  rate: number,
  per: number,
  nper: number,
  pv: number,
  fv: number,
  type: number,
) {
  // Credits: algorithm inspired by Apache OpenOffice
  fv = fv || 0
  type = type || 0

  rate = utils.parseNumber(rate)
  per = utils.parseNumber(per)
  nper = utils.parseNumber(nper)
  pv = utils.parseNumber(pv)
  fv = utils.parseNumber(fv)
  type = utils.parseNumber(type)

  if (utils.anyIsError(rate, per, nper, pv, fv, type)) {
    return error.value
  }

  // Compute payment
  const payment = PMT(rate, nper, pv, fv, type)

  // Compute interest
  let interest =
    per === 1
      ? type === 1
        ? 0
        : -pv
      : type === 1
      ? FV(rate, per - 2, payment, pv, 1) - payment
      : FV(rate, per - 1, payment, pv, 0)

  // Return interest
  return interest * rate
}

/**
 * Returns the cumulative interest paid between two periods.
 *
 * Category: Financial
 *
 * @param {*} rate The interest rate.
 * @param {*} nper The total number of payment periods.
 * @param {*} pv The present value.
 * @param {*} start_period The first period in the calculation. Payment periods are numbered beginning with 1.
 * @param {*} end_period The last period in the calculation.
 * @param {*} type The timing of the payment.
 * @returns
 */
export function CUMIPMT(rate, nper, pv, start_period, end_period, type) {
  rate = utils.parseNumber(rate)
  nper = utils.parseNumber(nper)
  pv = utils.parseNumber(pv)

  if (utils.anyIsError(rate, nper, pv)) {
    return error.value
  }

  if (rate <= 0 || nper <= 0 || pv <= 0) {
    return error.num
  }

  if (start_period < 1 || end_period < 1 || start_period > end_period) {
    return error.num
  }

  if (type !== 0 && type !== 1) {
    return error.num
  }

  const payment = PMT(rate, nper, pv, 0, type)
  let interest = 0

  if (start_period === 1) {
    if (type === 0) {
      interest = -pv
    }

    start_period++
  }

  for (let i = start_period; i <= end_period; i++) {
    interest +=
      type === 1 ? FV(rate, i - 2, payment, pv, 1) - payment : FV(rate, i - 1, payment, pv, 0)
  }

  interest *= rate

  return interest
}

/**
 * Returns the cumulative principal paid on a loan between two periods.
 *
 * Category: Financial
 *
 * @param {*} rate The interest rate.
 * @param {*} nper The total number of payment periods.
 * @param {*} pv The present value.
 * @param {*} start_period The first period in the calculation. Payment periods are numbered beginning with 1.
 * @param {*} end_period The last period in the calculation.
 * @param {*} type The timing of the payment.
 * @returns
 */
export function CUMPRINC(
  rate: number,
  nper: number,
  pv: number,
  start_period: number,
  end: number,
  type: number = 0,
) {
  // Credits: algorithm inspired by Apache OpenOffice
  // Credits: Hannes Stiebitzhofer for the translations of function and variable names
  rate = utils.parseNumber(rate)
  nper = utils.parseNumber(nper)
  pv = utils.parseNumber(pv)

  if (utils.anyIsError(rate, nper, pv)) {
    return error.value
  }

  // Return error if either rate, nper, or value are lower than or equal to zero
  if (rate <= 0 || nper <= 0 || pv <= 0) {
    console.log('here1')
    return error.num
  }

  // Return error if start < 1, end < 1, or start > end
  if (start_period < 1 || end < 1 || start_period > end) {
    console.log('here2')
    return error.num
  }

  // Return error if type is neither 0 nor 1
  if (type !== 0 && type !== 1) {
    console.log('here3')
    return error.num
  }

  // Compute cumulative principal
  const payment = PMT(rate, nper, pv, 0, type)
  let principal = 0

  if (start_period === 1) {
    principal = type === 0 ? payment + pv * rate : payment

    start_period++
  }

  for (let i = start_period; i <= end; i++) {
    principal +=
      type > 0
        ? payment - (FV(rate, i - 2, payment, pv, 1) - payment) * rate
        : payment - FV(rate, i - 1, payment, pv, 0) * rate
  }

  // Return cumulative principal
  return principal
}
