export enum Config {
  TOGGL_API_AUTH = 'Toggl API Auth',
  TOGGL_WORKSPACE_ID = 'Toggl Workspace ID',
  TOGGL_PROJECT_IDS = 'Toggl Project IDs',

  USE_FAKE_DATA = 'Use Fake Data',
  YEAR = 'Year',

  OFF_DAYS = 'Off Days',

  THEME = 'Theme',

  FONT = 'Font',
  FONT_SIZE = 'Font Size',

  CALENDAR_BACKGROUND = 'Calendar Background',
  CALENDAR_TEXT_COLOR = 'Calendar Text Color',
  CALENDAR_BORDER_COLOR = 'Calendar Border Color',
  CALENDAR_BORDER_RADIUS = 'Calendar Border Radius',
  CALENDAR_PADDING = 'Calendar Padding',

  TOOLTIP_BACKGROUND = 'Tooltip Background',
  TOOLTIP_TEXT_COLOR = 'Tooltip Text Color',

  NORMAL_DAY_BACKGROUND = 'Normal Day Background',
  OFF_DAY_BACKGROUND = 'Off Day Background',
  INTENSITY_COLOR = 'Intensity Color',

  STATISTICS_COLOR = 'Statistics Color',
  BILLABLE_REPORT_COLOR = 'Billable Report Color',

  PAYED_HOURS = 'Payed Hours',
  HOURLY_RATE = 'Hourly Rate',
  HOURLY_RATE_CURRENCY = 'Hourly Rate Currency',
  CONVERSION_FEE = 'Conversion Fee',
  CONVERSION_CURRENCY = 'Conversion Currency',

  CELL_SIZE = 'Cell Size',

  LINE_HEIGHT = 'Line Height',

  SHOW_GENERAL_STATS = 'Show General Statistics',
  SHOW_STREAKS_STATS = 'Show Streaks Statistics',
  SHOW_BILLABLE_STATS = 'Show Billable Information',
}


export enum Phrases {
  SETTINGS_TITLE = 'Settings',
  SETTINGS_DESCRIPTION = '',

  AVERAGE = 'Average',
  DEV = 'Deviation',
  MIN = 'Minimum',
  MAX = 'Maximum',
  SUM = 'Summary',

  PAYED = 'Payed',
  PAYABLE = 'Payable',
  REMAINS = 'Remains',
  BILLABLE = 'Billable',

  STREAK_COUNT = 'Streaks',
  AVERAGE_STREAK = 'Average',
  LONGEST_STREAK = 'Longest',

  ERROR_INVALID_TOGGL_API_AUTH = "Invalid or Missing Toggl API Token\n\nThe provided Toggl API token is either missing or invalid.\nPlease ensure the following:\n  1. Enter a valid API token from your Toggl account.\n  2. Verify the token length and ensure it matches the required format.\n\nYou can retrieve your API token from your Toggl Profile Settings.\nFor further assistance, refer to the Toggl API documentation.",
  ERROR_INVALID_TOGGL_WORKSPACE_ID = "Invalid Workspace ID\n\nThe provided Toggl Workspace ID is invalid. Please ensure the following:\n  1. Enter the correct Workspace ID associated with your Toggl account.\n  2. Verify the ID matches the format expected by the Toggl API.\n\nYou can find your Workspace ID in your Toggl Workspace Settings.\nFor further details, consult the Toggl API documentation.",
  ERROR_INVALID_YEAR = "Invalid Year\n\nThe provided year is invalid. Please ensure the following:\n  1. Enter a valid year in the correct format (e.g., 2023).\n  2. Ensure the year is within a reasonable range (e.g., 2000-2100).\n\nThis field is required to generate the heatmap calendar.",
}


export const Descriptions = {
  [Config.TOGGL_API_AUTH]: 'Authenticate with Toggl by providing your API token to fetch time tracking data. Retrieve your token from Toggl Profile Settings. Leave blank to use fake data instead.',
  [Config.TOGGL_WORKSPACE_ID]: 'Enter the Workspace ID associated with your Toggl account to fetch data for the correct workspace. Find it in your Toggl Workspace Settings.',
  [Config.TOGGL_PROJECT_IDS]: 'Enter specific Toggl Project IDs (comma-separated) to filter data for selected projects. Leave blank to include all projects.',
  [Config.USE_FAKE_DATA]: 'Enable this option to generate and use fake time tracking data instead of fetching data from Toggl. Useful for testing or demonstrations.',
  [Config.YEAR]: 'Specify the year for which the heatmap calendar will be generated. Must be in YYYY format (e.g., 2023).',
  [Config.OFF_DAYS]: 'Specify days you don’t expect to log time (e.g., weekends). Use numbers: Sun = 0, Mon = 1, Tue = 2, Wed = 3, Thu = 4, Fri = 5, Sat = 6. Separate multiple days with commas (e.g., 0,6 for Sun and Sat). Off days do not affect streak lengths.',
  [Config.THEME]: 'Select a theme to customize the heatmap calendar’s appearance. Choosing a theme will automatically update related style configurations, such as colors and gradients, affecting how the heatmap is displayed.',
  [Config.FONT]: 'Choose the font style for the heatmap calendar. We recommend Iosevka (included in predefined themes) for its clean and modern design. This affects the text displayed in the calendar, such as dates and labels.',
  [Config.FONT_SIZE]: 'Set the base font size for the heatmap calendar. Adjusting this value will proportionally scale other text elements, such as labels and annotations. Use a number (e.g., 24).',
  [Config.CALENDAR_BACKGROUND]: 'Set the background of the heatmap calendar. Use named colors (e.g., white), hex codes (e.g., #fff2 for semi-transparency), or gradients. Gradients are prioritized in themes.',
  [Config.CALENDAR_TEXT_COLOR]: 'Define the color for text elements, including day names, month names, and the year. Use named colors (e.g., black) or hex codes (e.g., #000000).',
  [Config.CALENDAR_BORDER_COLOR]: 'Choose the color for the calendar’s border. Use named colors (e.g., gray) or hex codes (e.g., #cccccc).',
  [Config.CALENDAR_BORDER_RADIUS]: 'Adjust the corner radius for the calendar’s border to control its roundedness. Use a number (e.g., 5).',
  [Config.CALENDAR_PADDING]: 'Set the outer spacing around the entire calendar. Use a number (e.g., 10) to control the margin between the calendar and surrounding elements.',
  [Config.TOOLTIP_BACKGROUND]: 'Set the background color for tooltips displayed when hovering over calendar cells. Use named colors (e.g., white), hex codes (e.g., #ffffff), or gradients.',
  [Config.TOOLTIP_TEXT_COLOR]: 'Define the color of the text inside tooltips. Use named colors (e.g., black) or hex codes (e.g., #000000).',
  [Config.NORMAL_DAY_BACKGROUND]: 'Set the background color for regular days. Use named colors (e.g., lightgray) or hex codes (e.g., #f0f0f0).',
  [Config.OFF_DAY_BACKGROUND]: 'Define the background color for off days (e.g., weekends or holidays). Use named colors (e.g., gray) or hex codes (e.g., #cccccc).',
  [Config.INTENSITY_COLOR]: 'Choose the color gradient used to represent activity intensity in the heatmap. Use named colors, hex codes, or gradients.',
  [Config.STATISTICS_COLOR]: 'Set the color for statistical elements (e.g., averages or totals) displayed in the calendar. Use named colors or hex codes.',
  [Config.BILLABLE_REPORT_COLOR]: 'Define the color for billable hours or reports in the heatmap. Use named colors or hex codes.',
  [Config.PAYED_HOURS]: 'Enter the total hours that have already been paid. This helps track remaining billable hours.',
  [Config.HOURLY_RATE]: 'Set the hourly rate used for calculating billable amounts. Enter a numeric value (e.g., 50).',
  [Config.HOURLY_RATE_CURRENCY]: 'Specify the currency for the hourly rate (e.g., USD, EUR). This ensures accurate billing calculations.',
  [Config.CONVERSION_FEE]: 'Enter any additional fee applied during currency conversion. Use a numeric value (e.g., 0.02 for 2%).',
  [Config.CONVERSION_CURRENCY]: 'Set the target currency for conversion (e.g., USD to EUR). This is used for final billing calculations.',
  [Config.CELL_SIZE]: 'Set the size of each cell. Adjust this to control the overall dimensions of the calendar. Use a number around 10 (e.g., 7 to 15).',
  [Config.LINE_HEIGHT]: 'Define the height of lines for statistics, billable reports, and other text blocks. Use a number (e.g., 20) for consistent spacing.',
  [Config.SHOW_BILLABLE_STATS]: 'Enable this option to display billable information (e.g., payed, remains).',
  [Config.SHOW_GENERAL_STATS]: 'Enable this option to display general statistics (e.g., total hours, averages).',
  [Config.SHOW_STREAKS_STATS]: 'Enable this option to display streak statistics (e.g., longest streak, current streak).',
};


export const IntensityColors = {
  '#ff0000': 'Red',
  '#00ff00': 'Green',
  '#0000ff': 'Blue',
  '#ffff00': 'Yellow',
  '#ff00ff': 'Magenta',
  '#00ffff': 'Cyan',
  '#ffffff': 'White',
  '#ff8800': 'Orange',
  '#ff0088': 'Pink',
  '#88ff00': 'Lime',
  '#00ff88': 'Mint',
  '#8800ff': 'Purple',
  '#0088ff': 'Azure',
}


export const Days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
