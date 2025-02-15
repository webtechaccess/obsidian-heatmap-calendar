import {Editor, MarkdownView, Plugin} from 'obsidian'
import {Settings} from './Settings'
import {Helper} from './Helper'
import {Fake} from './providers/Fake'
import {Toggl} from './providers/Toggl'
import {Canvas} from './Canvas'
import {Config, Phrases} from './Consts'
import {General} from './Themes'


export default class Main extends Plugin {
  static cache = {}

  static clearCache() {
    Main.cache = {}
  }

  async onload() {

    this.registerEvent(
      this.app.workspace.on('active-leaf-change', () => {
        Main.clearCache()
      })
    );

    // @ts-ignore
    window.clhc_render = (id, params) => {
      params.id = id
      return this.render(params)
    }

    this.addCommand({
      id: 'insert',
      name: 'Insert',
      callback: () => {
        const initialParams = {
          [Config.TOGGL_API_AUTH]: '',
          [Config.TOGGL_WORKSPACE_ID]: '',
          [Config.TOGGL_PROJECT_IDS]: '[]',
          [Config.USE_FAKE_DATA]: true,
          [Config.YEAR]: new Date().getFullYear(),
          [Config.OFF_DAYS]: '[]',
          [Config.THEME]: 'Dark',

          [Config.INTENSITY_COLOR]: '#00ff88',
          [Config.PAYED_HOURS]: 0,
          [Config.HOURLY_RATE]: 0,
          [Config.HOURLY_RATE_CURRENCY]: 'USD',
          [Config.CONVERSION_FEE]: 0,
          [Config.CONVERSION_CURRENCY]: 'USD',
          [Config.SHOW_GENERAL_STATS]: true,
          [Config.SHOW_STREAKS_STATS]: true,
          [Config.SHOW_BILLABLE_STATS]: true,

          //from theme
          [Config.FONT]: General[Config.FONT],
          [Config.FONT_SIZE]: General[Config.FONT_SIZE],
          [Config.CALENDAR_BORDER_RADIUS]: General[Config.CALENDAR_BORDER_RADIUS],
          [Config.CALENDAR_PADDING]: General[Config.CALENDAR_PADDING],
          [Config.CELL_SIZE]: General[Config.CELL_SIZE],
          [Config.LINE_HEIGHT]: General[Config.LINE_HEIGHT],

          [Config.THEME]: 'dark',
          [Config.CALENDAR_BACKGROUND]: '#111, #272727',
          [Config.CALENDAR_TEXT_COLOR]: '#ddd',
          [Config.NORMAL_DAY_BACKGROUND]: '#444',
          [Config.OFF_DAY_BACKGROUND]: '#2a2a2a',
          [Config.STATISTICS_COLOR]: 'white',
          [Config.BILLABLE_REPORT_COLOR]: 'white',
          [Config.TOOLTIP_BACKGROUND]: 'white',
          [Config.TOOLTIP_TEXT_COLOR]: 'black',
        }

        initialParams['id'] = Helper.generateHex(32)

        const script = Main.generateScript(initialParams)
        const editor = this.app.workspace.activeEditor.editor
        editor.replaceRange(script, editor.getCursor())

        this.openSettings(initialParams)
      },
    })
  }


  static generateScript(attributes) {
    let script = '\n\n```dataviewjs\n'
    script += `dv.paragraph("").appendChild(clhc_render("${attributes.id}", {\n`

    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'id') return

      if (typeof value === 'number') {
        script += `  '${key}': ${value},\n`
      } else if (typeof value === 'boolean') {
        script += `  '${key}': ${value},\n`
      } else if (Array.isArray(value)) {
        const json = JSON.stringify(value)
        script += `  '${key}': "${json}",\n`
      } else if (typeof value === 'string') {
        script += `  '${key}': "${value}",\n`
      }
    })

    script += '}))\n'
    script += '```\n\n'
    return script
  }


  openSettings(params) {
    new Settings(this.app, params, async (attributes) => {
      const script = Main.generateScript(attributes)
      const activeFile = this.app.workspace.getActiveFile()
      const fileContent = await this.app.vault.read(activeFile)
      const pattern = new RegExp('\\s*```[^`]*\"' + params.id + '\"[^`]*```\\s*', 'gs')
      const modifiedContent = fileContent.replace(pattern, script)
      await this.app.vault.modify(activeFile, modifiedContent)
    }).open()
  }


  render(params) {
    const div = createEl('div', { text: "Loading...", attr: {class: 'clhc-container-div'} })

    Main.validate(params)

    const cacheAlias = params.id + "-" + (params[Config.USE_FAKE_DATA] ? 'fake' : 'toggl')

    if (Main.cache[cacheAlias]) {
      Canvas.render(div, params, Main.cache[cacheAlias])
    } else {
      if (params[Config.USE_FAKE_DATA]) {
        Fake.fetch(params, (data) => {
          Main.cache[cacheAlias] = data
          Canvas.render(div, params, data)
        })
      } else {
        Toggl.fetch(params, (data) => {
          Main.cache[cacheAlias] = data
          Canvas.render(div, params, data)
        })
      }
    }

    div.addEventListener('click', () => {
      this.openSettings(params)
    })

    return div
  }


  static validate(params) {
    if (!params[Config.YEAR] || params[Config.YEAR] < 2000 || params[Config.YEAR] > 2100) {
      Canvas.setError(Phrases.ERROR_INVALID_YEAR)
      return
    }

    Canvas.clearError()
  }
}
