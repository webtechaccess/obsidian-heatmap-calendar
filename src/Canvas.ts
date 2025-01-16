import {Helper} from './Helper'
import {Config, Days, Phrases} from './Consts'

export class Canvas {
  static error = undefined

  static setError(title) {
    Canvas.error = title
  }

  static clearError() {
    Canvas.error = undefined
  }


  static render(div, params, times) {
    // @ts-ignore
    const durations = Object.values(times).map(item => item.totalDuration)

    const minDuration = Math.min(...durations)
    const maxDuration = Math.max(...durations)

    let totalSum = 0

    for (let date in times) {
      totalSum += times[date].totalDuration
    }

    const averageDuration = durations.reduce((acc, val) => acc + val, 0) / 365

    const varianceDuration = durations.reduce((acc, val) => acc + Math.pow(val - averageDuration, 2), 0) / 365
    const stdDevDuration = Math.sqrt(varianceDuration)

    const stats = Helper.computeStreakStats(params, times)

    const existingCanvas = div.querySelectorAll('canvas')
    existingCanvas.forEach(canvas => canvas.remove())

    const canvas = document.createElement('canvas')
    canvas.addClass('clhc-canvas')

    const tooltipCanvas = document.createElement('canvas')
    tooltipCanvas.addClass('clhc-tooltip-canvas')

    const cellSize = params[Config.CELL_SIZE]
    const padding = cellSize / 5
    let topOffset = params[Config.CALENDAR_PADDING] + params[Config.LINE_HEIGHT]
    let leftOffset = params[Config.CALENDAR_PADDING] + 30
    let lineCount = 0

    if (params[Config.SHOW_BILLABLE_STATS]) lineCount++
    if (params[Config.SHOW_STREAKS_STATS]) lineCount++
    if (params[Config.SHOW_GENERAL_STATS]) lineCount++
    if (lineCount > 0) lineCount++

    if (params[Config.FONT_SIZE] === 0) {
      lineCount = 0
      topOffset = params[Config.CALENDAR_PADDING]
      leftOffset = params[Config.CALENDAR_PADDING]
    }

    let bottomOffset = lineCount * params[Config.LINE_HEIGHT]

    let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (params[Config.YEAR] % 4 === 0) daysInMonth[1] = 29

    let yIndex = 0
    let xIndex = 0
    let lastRenderX = 0

    for (let month = 0; month < 12; month++) {
      for (let day = 1; day <= daysInMonth[month]; day++) {
        const x = xIndex * (cellSize + padding)
        const renderX = x + month * (cellSize + padding + cellSize) + leftOffset
        lastRenderX = renderX
        yIndex++
        if (yIndex === 7) {
          xIndex++
          yIndex = 0
        }
      }
    }

    canvas.width = lastRenderX + cellSize + params[Config.CALENDAR_PADDING]
    canvas.height = 7 * (cellSize + padding) + topOffset + bottomOffset + params[Config.CALENDAR_PADDING]

    tooltipCanvas.width = canvas.width
    tooltipCanvas.height = canvas.height

    if (params[Config.CALENDAR_BORDER_COLOR]) {
      canvas.style.setProperty('--clhc-calendar-border-color', params[Config.CALENDAR_BORDER_COLOR]);
    }

    canvas.style.setProperty('--clhc-calendar-border-radius', params[Config.CALENDAR_BORDER_RADIUS] + 'px');
    canvas.style.setProperty('--clhc-calendar-background', params[Config.CALENDAR_BACKGROUND]);

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function drawText(text: string, x: number, y: number) {
      const dimFilter = 'opacity(0.75)'
      ctx.filter = dimFilter

      const parts = text.split(/(<|>)/)

      parts.forEach(part => {
        if (part === '<') {
          ctx.filter = 'none'
        } else if (part === '>') {
          ctx.filter = dimFilter
        } else {
          ctx.fillText(part, x, y)
          x += ctx.measureText(part).width
        }
      })

      ctx.filter = 'none'
    }

    ctx.imageSmoothingEnabled = true

    if (Canvas.error) {
      const lines = Canvas.error.split('\n')
      const title = lines[0]
      const descriptions = lines.slice(1)

      let y = 30
      ctx.fillStyle = '#212'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#f44'
      ctx.font = Helper.computeFont(params, 20)
      ctx.fillText(title, canvas.width / 2, y)

      if (descriptions) {
        ctx.font = Helper.computeFont(params, 16)
        ctx.textAlign = 'left'
        ctx.fillStyle = '#aaa'

        descriptions.forEach((line) => {
          y += 20
          ctx.fillText(line, 20, y)
        })
      }

      div.setText('')
      div.appendChild(canvas)
      return
    }

    const tooltipCtx = tooltipCanvas.getContext('2d')

    const monthNames = [...Array(12)].map((_, i) => new Date(0, i).toLocaleString('default', {month: 'short'}))

    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.font = Helper.computeFont(params, 14)
    ctx.fillStyle = params[Config.CALENDAR_TEXT_COLOR]
    ctx.fillText('' + params[Config.YEAR], params[Config.CALENDAR_PADDING], params[Config.CALENDAR_PADDING])

    for (let i = 0; i < Days.length; i++) {
      const x = params[Config.CALENDAR_PADDING]
      const y = i * (cellSize + padding) + topOffset + cellSize / 2
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.font = Helper.computeFont(params, 11)
      ctx.fillStyle = params[Config.CALENDAR_TEXT_COLOR]
      ctx.fillText(Days[i], x, y)
    }

    yIndex = 0
    xIndex = 0
    let cellData = []

    lastRenderX = 0
    let maxY = 0

    yIndex = Helper.getDayOfWeek(params[Config.YEAR] + '-01-01')

    for (let month = 0; month < 12; month++) {
      for (let day = 1; day <= daysInMonth[month]; day++) {
        const date = `${params[Config.YEAR]}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const value = times[date]
        const duration = value ? value.totalDuration : 0
        const humanize = value ? value.humanize : '0:00'

        const x = xIndex * (cellSize + padding)
        const y = yIndex * (cellSize + padding)

        const renderX = x + month * (cellSize + padding + cellSize) + leftOffset
        const renderY = y + topOffset

        lastRenderX = renderX
        if (renderY > maxY) {
          maxY = renderY
        }

        ctx.fillStyle = 'transparent'

        if (value) {
          ctx.fillStyle = Helper.getColor(params, duration, maxDuration)
        } else {
          if (params[Config.OFF_DAYS].includes(yIndex)) {
            ctx.fillStyle = params[Config.OFF_DAY_BACKGROUND]
          } else {
            ctx.fillStyle = params[Config.NORMAL_DAY_BACKGROUND]
          }
        }

        ctx.fillRect(renderX, renderY, cellSize, cellSize)
        cellData.push({date, x: renderX, y: renderY, width: cellSize, height: cellSize, value: humanize ?? 0})

        yIndex++

        if (yIndex === 7) {
          xIndex++
          yIndex = 0
        }
      }

      ctx.font = Helper.computeFont(params, 12)
      ctx.fillStyle = params[Config.CALENDAR_TEXT_COLOR]
      ctx.textAlign = 'right'
      ctx.textBaseline = 'top'
      ctx.fillText(monthNames[month], lastRenderX - cellSize, params[Config.CALENDAR_PADDING])
    }

    ctx.textBaseline = 'top'

    let y = maxY + params[Config.LINE_HEIGHT]

    function addStat(name, value): string {
      return Helper.fixLength(name + ': <' + value, 25) + '>'
    }

    if (params[Config.SHOW_BILLABLE_STATS]) {
      y += params[Config.LINE_HEIGHT]

      let total = Math.round(totalSum * params[Config.HOURLY_RATE])
      let payed = params[Config.PAYED_HOURS] * params[Config.HOURLY_RATE]
      let remains = total - payed
      let converted = remains * params[Config.CONVERSION_FEE]
      let payStr = addStat(Phrases.PAYED, new Intl.NumberFormat().format(payed) + ' ' + params[Config.HOURLY_RATE_CURRENCY])
      payStr += addStat(Phrases.PAYABLE, new Intl.NumberFormat().format(total) + ' ' + params[Config.HOURLY_RATE_CURRENCY])
      payStr += addStat(Phrases.REMAINS, new Intl.NumberFormat().format(remains) + ' ' + params[Config.HOURLY_RATE_CURRENCY])
      payStr += addStat(Phrases.BILLABLE, new Intl.NumberFormat().format(converted) + ' ' + params[Config.CONVERSION_CURRENCY])
      ctx.textAlign = 'left'
      ctx.font = Helper.computeFont(params, 14)
      ctx.fillStyle = params[Config.BILLABLE_REPORT_COLOR]
      drawText(payStr, params[Config.CALENDAR_PADDING], y)
    }

    if (params[Config.SHOW_GENERAL_STATS]) {
      y += params[Config.LINE_HEIGHT]
      let str = addStat(Phrases.AVERAGE, Helper.convertToHourMin(averageDuration))
      str += addStat(Phrases.DEV, Helper.convertToHourMin(stdDevDuration))
      str += addStat(Phrases.MIN, Helper.convertToHourMin(minDuration))
      str += addStat(Phrases.MAX, Helper.convertToHourMin(maxDuration))
      str += addStat(Phrases.SUM, Helper.convertToHourMin(totalSum))

      ctx.textAlign = 'left'
      ctx.font = Helper.computeFont(params, 14)
      ctx.fillStyle = params[Config.STATISTICS_COLOR]
      drawText(str, params[Config.CALENDAR_PADDING], y)
    }

    if (params[Config.SHOW_STREAKS_STATS]) {
      y += params[Config.LINE_HEIGHT]
      let str = addStat(Phrases.STREAK_COUNT, stats.streakCount)
      str += addStat(Phrases.AVERAGE_STREAK, Math.round(stats.averageStreak))
      str += addStat(Phrases.LONGEST_STREAK, stats.longestStreak)

      ctx.textAlign = 'left'
      ctx.font = Helper.computeFont(params, 14)
      ctx.fillStyle = params[Config.STATISTICS_COLOR]
      drawText(str, params[Config.CALENDAR_PADDING], y)
    }

    div.setText('')
    div.appendChild(canvas)
    div.appendChild(tooltipCanvas)

    if (!tooltipCtx) { return }

    canvas.addEventListener('mousemove', (event) => {
      const mouseX = event.offsetX
      const mouseY = event.offsetY
      let found = false


      tooltipCtx.clearRect(0, 0, tooltipCanvas.width, tooltipCanvas.height)

      if (params[Config.TOOLTIP_BACKGROUND]) {
        for (let cell of cellData) {
          if (mouseX >= cell.x && mouseX <= cell.x + cell.width &&
            mouseY >= cell.y && mouseY <= cell.y + cell.height) {
            tooltipCtx.fillStyle = params[Config.TOOLTIP_BACKGROUND]
            tooltipCtx.fillRect(mouseX - 150 / 2, mouseY + 5, 150, 30)

            tooltipCtx.textAlign = 'center'
            tooltipCtx.font = Helper.computeFont(params, 12)
            tooltipCtx.fillStyle = params[Config.TOOLTIP_TEXT_COLOR]
            tooltipCtx.fillText(`${cell.date} | ${cell.value} Hours`, mouseX, mouseY + 25)
            found = true
            break
          }
        }
      }

      if (!found) {
        tooltipCtx.clearRect(0, 0, tooltipCanvas.width, tooltipCanvas.height)
      }
    })

    canvas.addEventListener('mouseout', (event) => {
      tooltipCtx.clearRect(0, 0, tooltipCanvas.width, tooltipCanvas.height)
    })
  }
}
