import {Config} from './Consts'

export class Helper {
  static fixLength(str: string, length: number): string {
    return str.padEnd(length, ' ');
  }


  static computeFont(params, size: number): string {
    return (size / 12) * params[Config.FONT_SIZE] + "px " + params[Config.FONT]
  }


  static isNumber(str: string): boolean {
    if (typeof str !== 'string' || str.trim() === '') {
      return false;
    }

    return !isNaN(parseFloat(str));
  }


  static convertToHourMin(duration): string {
    if (isNaN(duration)) {
      return '0:00'
    }

    const hours = Math.floor(duration)
    const minutes = Math.round((duration - hours) * 60)
    return `${hours}:${minutes.toString().padStart(2, '0')}`
  }


  static generateHex(length: number): string {
    const characters = '0123456789abcdef';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }


  static getDayOfWeek(dateString: string): number {
    const date = new Date(dateString)
    return date.getDay()
  }


  static getColor(params, value: number, max: number): string {
    const minValue = 75;
    const intensity = Math.floor(((value / max) * (255 - minValue)) + minValue);

    const maxIntensityColor = params[Config.INTENSITY_COLOR];

    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const computeLowerIntensity = (color, intensity) => {
      const { r, g, b } = hexToRgb(color);
      const scale = intensity / 255; // Scale factor based on intensity
      return `rgb(${Math.floor(r * scale)}, ${Math.floor(g * scale)}, ${Math.floor(b * scale)})`;
    };

    return computeLowerIntensity(maxIntensityColor, intensity);
  }


  static getStreaks(params, times) {
    const dates = Object.keys(times).map(date => new Date(date))
    dates.sort((a, b) => a.getTime() - b.getTime())

    let streaks = []
    let currentStreak = 1

    for (let i = 1; i < dates.length; i++) {
      let isOff = params[Config.OFF_DAYS].includes(dates[i - 1].getDay())

      const diffInDays = (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24)
      if (diffInDays === 1 || isOff) {
        currentStreak++
      } else {
        streaks.push(currentStreak)
        currentStreak = 1
      }
    }

    streaks.push(currentStreak)
    return streaks
  }


  static computeStreakStats(params, times) {
    const streaks = this.getStreaks(params, times)
    const streakCount = streaks.length
    const averageStreak = streaks.reduce((acc, val) => acc + val, 0) / streakCount
    const longestStreak = Math.max(...streaks)

    return {streakCount, averageStreak, longestStreak}
  }
}
