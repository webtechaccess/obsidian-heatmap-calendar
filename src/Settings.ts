import {App, Modal, Setting, TextComponent, ValueComponent} from 'obsidian'
import {Descriptions, Config, IntensityColors, Phrases} from './Consts'
import {Dark, Light, Minimal, Vivid} from './Themes'
import {Canvas} from './Canvas'
import Main from './Main'

export class Settings extends Modal {
  tabContainer: HTMLElement
  tabContentContainer: HTMLElement
  tabsContent: HTMLElement[] = []
  tabsNames: string[] = ["Query", "Style", "Billable", "Stats", "Donate"]
  config: any
  onSubmit: (result) => void
  static settingsMap = {}
  static componentMap = {}


  constructor(app: App, config, onSubmit: (result) => void) {
    super(app)
    this.config = config
    this.onSubmit = onSubmit
  }


  onOpen() {
    const that = this
    const { containerEl, contentEl } = this;

    containerEl.addClass('clhc');

    const header = this.titleEl;
    header.innerHTML = Phrases.SETTINGS_TITLE

    // const headerDescription = this.contentEl.createEl("p");
    // headerDescription.innerHTML = Phrases.SETTINGS_DESCRIPTION

    let params = {}

    Object.entries(this.config).forEach(([key, value]) => {
      params[key] = value
    })

    this.tabContainer = contentEl.createDiv({ cls: 'tabs' });
    this.tabContentContainer = contentEl.createDiv({ cls: 'tab-content' });

    for (let i=0; i<this.tabsNames.length; i++) {
      const tab = this.tabContainer.createEl('button', { text: this.tabsNames[i] });
      tab.onclick = () => this.showTab(i);
      this.tabsContent.push(this.tabContentContainer.createDiv())
    }

    let tabQuery = this.tabsContent[0]
    let tabStyle = this.tabsContent[1]
    let tabBillable = this.tabsContent[2]
    let tabStats = this.tabsContent[3]
    let tabDonation = this.tabsContent[4]

    function add(tab, type, name, options = null, onChange = null) {
      const key = name
      const setting = new Setting(tab).setDesc(Descriptions[key] ?? '')

      const callback = (control) => {
        Settings.componentMap[key] = control

        if (type.includes("select")) {
          control.addOptions(options)
        }

        if (type === "number") {
          control.setValue('' + params[key])
        } else if (type.includes("array")) {
          control.setValue(JSON.parse(params[key] ?? '[]').join(", "))
        } else {
          control.setValue(params[key])
        }

        control.updateValue = (value) => {
          control.setValue(value)
          control.updateValueCore(value)
        }

        control.updateValueCore = (value) => {
          Canvas.clearError()

          if (key === Config.TOGGL_API_AUTH ||
            key === Config.TOGGL_WORKSPACE_ID ||
            key === Config.USE_FAKE_DATA ||
            key === Config.YEAR ||
            key === Config.TOGGL_PROJECT_IDS ||
            key === Config.OFF_DAYS
          ) {
            Main.clearCache()
          }


          if (type === "number") {
            params[key] = parseInt(value)
          } else if (type.includes("array")) {
            params[key] = `[${value.split(',').map(item => item.trim()).join(',')}]`
          } else {
            params[key] = value
          }

          Main.validate(params)
          if (onChange) onChange(value)
          that.onSubmit(params)
        }

        control.onChange((value) => {
          control.updateValueCore(value)
        })

        if (type.includes("long")) {
          control.inputEl.style.width = "65%"
        }
      }

      if (type === "check") {
        setting.addToggle(callback)
      } else if (type.includes('select')) {
        setting.addDropdown(callback)
      } else {
        setting.addText(callback)
      }

      const descEl = document.createElement("div");
      descEl.textContent = name;
      setting.controlEl.insertBefore(descEl, setting.controlEl.firstChild);

      Settings.settingsMap[key] = setting
      return setting
    }

    add(tabQuery, "long-text", Config.TOGGL_API_AUTH)
    add(tabQuery, "number", Config.TOGGL_WORKSPACE_ID)
    add(tabQuery, "check", Config.USE_FAKE_DATA)
    add(tabQuery, "number", Config.YEAR)
    add(tabQuery, "long-array", Config.TOGGL_PROJECT_IDS)
    add(tabQuery, "array", Config.OFF_DAYS)
    add(tabQuery, "select", Config.INTENSITY_COLOR, IntensityColors)

    function applyTheme(theme) {
      Object.entries(theme).forEach(([key, value]) => {
        Settings.componentMap[key].updateValue(value)
      })
    }

    add(tabStyle, "select", Config.THEME, {
      dark: 'Dark',
      light: 'Light',
      vivid: 'Vivid',
      minimal: 'Minimal',
    }, (value) => {
      if (value === 'dark') {
        applyTheme(Dark)
      } if (value === 'light') {
        applyTheme(Light)
      } if (value === 'vivid') {
        applyTheme(Vivid)
      } if (value === 'minimal') {
        applyTheme(Minimal)
      }
    })

    add(tabStyle, "long-text", Config.FONT)
    add(tabStyle, "number", Config.FONT_SIZE)

    add(tabStyle, "long-text", Config.CALENDAR_BACKGROUND)
    add(tabStyle, "color", Config.CALENDAR_TEXT_COLOR)
    add(tabStyle, "color", Config.CALENDAR_BORDER_COLOR)
    add(tabStyle, "number", Config.CALENDAR_BORDER_RADIUS)
    add(tabStyle, "number", Config.CALENDAR_PADDING)

    add(tabStyle, "color", Config.NORMAL_DAY_BACKGROUND)
    add(tabStyle, "color", Config.OFF_DAY_BACKGROUND)

    add(tabStyle, "color", Config.TOOLTIP_BACKGROUND)
    add(tabStyle, "color", Config.TOOLTIP_TEXT_COLOR)

    add(tabStyle, "color", Config.STATISTICS_COLOR)
    add(tabStyle, "color", Config.BILLABLE_REPORT_COLOR)

    add(tabStyle, "number", Config.CELL_SIZE)
    add(tabStyle, "number", Config.LINE_HEIGHT)

    add(tabBillable, "number", Config.PAYED_HOURS)
    add(tabBillable, "number", Config.HOURLY_RATE)
    add(tabBillable, "text", Config.HOURLY_RATE_CURRENCY)
    add(tabBillable, "number", Config.CONVERSION_FEE)
    add(tabBillable, "text", Config.CONVERSION_CURRENCY)

    add(tabStats, "check", Config.SHOW_BILLABLE_STATS)
    add(tabStats, "check", Config.SHOW_GENERAL_STATS)
    add(tabStats, "check", Config.SHOW_STREAKS_STATS)

    const donationEl = document.createElement("div");
    donationEl.innerHTML = "<span style='font-size: 100px; display: block; text-align: center'>💖</span><p>If you’ve enjoyed using this heatmap calendar or found it helpful, consider contributing to its development.</p><p>Your gift will help me improve features, fix bugs, and keep this project alive for the community.</p><p>Every contribution, is greatly appreciated!</p><ul><li>One-Time Donation: <a href='https://buy.stripe.com/00gaEM1lA7yF664fYY'>Donate via Stripe</a></li><li>Monthly Subscription: <a href='https://buy.stripe.com/14kbIQc0ebOVgKI9AB'>Subscribe via Stripe</a></li></ul>"
    tabDonation.append(donationEl)

    this.showTab(4);

    this.makeMovable(this.modalEl, header);
  }


  makeMovable(modal: HTMLElement, header: HTMLElement) {
    let isDragging = false;
    let startX = 0, startY = 0, offsetX = 0, offsetY = 0;

    header.addEventListener('mousedown', (e) => {
      isDragging = true;

      offsetX = modal.offsetLeft;
      offsetY = modal.offsetTop;
      startX = e.clientX;
      startY = e.clientY;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newLeft = offsetX + (e.clientX - startX);
      const newTop = offsetY + (e.clientY - startY);

      modal.style.position = 'absolute';
      modal.style.left = `${newLeft}px`;
      modal.style.top = `${newTop}px`;
    };

    const onMouseUp = () => {
      isDragging = false;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }


  showTab(index: number) {
    this.tabsContent.forEach(tabContent => {
      tabContent.style.display = 'none';
      tabContent.style.height = '0';
      tabContent.classList.remove('active');
    })

    for (let i=0; i<this.tabsNames.length; i++) {
      this.tabContainer.querySelector(`button:nth-child(${i+1})`)?.classList.remove('active');
    }

    this.tabContainer.querySelector(`button:nth-child(${index+1})`)?.classList.add('active');

    let currentTab = this.tabsContent[index]
    currentTab.style.display = 'block'
    currentTab.style.height = '300px'
    currentTab.classList.add('active')
  }


  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
