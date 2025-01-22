import {Config} from './Consts'

export const General = {
  [Config.FONT]: 'Iosevka, Courier New, monospace',
  [Config.FONT_SIZE]: 12,
  [Config.CALENDAR_BORDER_RADIUS]: 10,
  [Config.CALENDAR_PADDING]: 20,
  [Config.CELL_SIZE]: 10,
  [Config.LINE_HEIGHT]: 16,
}

export const Dark = {
  [Config.FONT]: General[Config.FONT],
  [Config.FONT_SIZE]: General[Config.FONT_SIZE],
  [Config.CALENDAR_BORDER_RADIUS]: General[Config.CALENDAR_BORDER_RADIUS],
  [Config.CALENDAR_PADDING]: General[Config.CALENDAR_PADDING],
  [Config.CELL_SIZE]: General[Config.CELL_SIZE],
  [Config.LINE_HEIGHT]: General[Config.LINE_HEIGHT],

  [Config.CALENDAR_BACKGROUND]: '#111, #272727',
  [Config.CALENDAR_TEXT_COLOR]: '#ddd',
  [Config.NORMAL_DAY_BACKGROUND]: '#444',
  [Config.OFF_DAY_BACKGROUND]: '#2a2a2a',
  [Config.STATISTICS_COLOR]: 'white',
  [Config.BILLABLE_REPORT_COLOR]: 'white',
  [Config.TOOLTIP_BACKGROUND]: 'white',
  [Config.TOOLTIP_TEXT_COLOR]: 'black',
}

export const Light = {
  [Config.FONT]: General[Config.FONT],
  [Config.FONT_SIZE]: General[Config.FONT_SIZE],
  [Config.CALENDAR_BORDER_RADIUS]: General[Config.CALENDAR_BORDER_RADIUS],
  [Config.CALENDAR_PADDING]: General[Config.CALENDAR_PADDING],
  [Config.CELL_SIZE]: General[Config.CELL_SIZE],
  [Config.LINE_HEIGHT]: General[Config.LINE_HEIGHT],

  [Config.CALENDAR_BACKGROUND]: '#eee, #f7f7f7',
  [Config.CALENDAR_TEXT_COLOR]: '#333',
  [Config.NORMAL_DAY_BACKGROUND]: '#ccc',
  [Config.OFF_DAY_BACKGROUND]: '#e4e4e4',
  [Config.STATISTICS_COLOR]: 'black',
  [Config.BILLABLE_REPORT_COLOR]: 'black',
  [Config.TOOLTIP_BACKGROUND]: 'black',
  [Config.TOOLTIP_TEXT_COLOR]: 'white',
}

export const Vivid = {
  [Config.FONT]: General[Config.FONT],
  [Config.FONT_SIZE]: General[Config.FONT_SIZE],
  [Config.CALENDAR_BORDER_RADIUS]: General[Config.CALENDAR_BORDER_RADIUS],
  [Config.CALENDAR_PADDING]: General[Config.CALENDAR_PADDING],
  [Config.CELL_SIZE]: General[Config.CELL_SIZE],
  [Config.LINE_HEIGHT]: General[Config.LINE_HEIGHT],

  [Config.CALENDAR_BACKGROUND]: '#822, #228',
  [Config.CALENDAR_TEXT_COLOR]: '#ccc',
  [Config.NORMAL_DAY_BACKGROUND]: '#fff4',
  [Config.OFF_DAY_BACKGROUND]: '#faa2',
  [Config.STATISTICS_COLOR]: '#ddf',
  [Config.BILLABLE_REPORT_COLOR]: '#ff0',
  [Config.TOOLTIP_BACKGROUND]: '#228c',
  [Config.TOOLTIP_TEXT_COLOR]: 'white',
}

export const Minimal = {
  [Config.FONT]: General[Config.FONT],
  [Config.FONT_SIZE]: 0,
  [Config.CALENDAR_BORDER_RADIUS]: 0,
  [Config.CALENDAR_PADDING]: 0,
  [Config.CELL_SIZE]: 6,
  [Config.LINE_HEIGHT]: 0,

  [Config.CALENDAR_BACKGROUND]: 'transparent',
  [Config.CALENDAR_TEXT_COLOR]: '',
  [Config.NORMAL_DAY_BACKGROUND]: '#8886',
  [Config.OFF_DAY_BACKGROUND]: '#8883',
  [Config.STATISTICS_COLOR]: '',
  [Config.BILLABLE_REPORT_COLOR]: '',
  [Config.TOOLTIP_BACKGROUND]: '',
  [Config.TOOLTIP_TEXT_COLOR]: '',
}
