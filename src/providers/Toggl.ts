import {Helper} from '../Helper'
import {Config, Phrases} from '../Consts'
import {Canvas} from '../Canvas'

export class Toggl {
  static async fetch(params, onDone) {
    const apiToken = params[Config.TOGGL_API_AUTH]
    if (!apiToken || apiToken.length !== 32) {
      Canvas.setError(Phrases.ERROR_INVALID_TOGGL_API_AUTH)
      onDone({})
      return
    }

    const workspaceId = params[Config.TOGGL_WORKSPACE_ID]
    if (!workspaceId) {
      Canvas.setError(Phrases.ERROR_INVALID_TOGGL_WORKSPACE_ID)
      onDone({})
      return
    }

    const projectIds = JSON.parse(params[Config.TOGGL_PROJECT_IDS] ?? '[]')
    const dailySummary = {}

    let projects = ''
    if (projectIds.length > 0) {
      projects = '&project_ids=' + projectIds.join(',')
    }

    const togglApiUrl = `https://api.track.toggl.com/reports/api/v2/details?workspace_id=${workspaceId}&user_agent=heatmap&since=${params[Config.YEAR]}-01-01&until=${params[Config.YEAR]}-12-31&per_page=1000000${projects}`

    try {
      const headers = {
        'Authorization': 'Basic ' + btoa(apiToken + ':api_token'),
      }

      const timeEntries = await this.fetchAllTimeEntries(togglApiUrl, headers)

      timeEntries.forEach(entry => {
        const date = entry.start.split('T')[0]
        const duration = entry.dur / 1000 / 60 / 60

        if (!dailySummary[date]) {
          dailySummary[date] = {totalDuration: 0, entries: []}
        }

        dailySummary[date].totalDuration += duration
        dailySummary[date].humanize = Helper.convertToHourMin(dailySummary[date].totalDuration)
      })
    } catch (error) {
    }

    onDone(dailySummary)
  }


  static async fetchAllTimeEntries(url: string, headers) {
    let allEntries = []
    const response = await fetch(`${url}`, {method: 'GET', headers})

    const data = await response.json()
    allEntries = allEntries.concat(data.data)

    return allEntries
  }
}
