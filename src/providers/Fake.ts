import {Config} from '../Consts'

export class Fake {
  static RECORDS_COUNT = 50

  static randomDuration(): number {
    return parseFloat((Math.random() * 2).toFixed(10));
  }


  static humanizeDuration(duration: number): string {
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }


  static randomDate(year: number): string {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const randomDate = new Date(randomTime);
    return randomDate.toISOString().split('T')[0];
  }


  static fetch(params, onDone) {
    const data = {};

    while (Object.keys(data).length < Fake.RECORDS_COUNT) {
      const date = this.randomDate(params[Config.YEAR]);

      if (!data[date]) {
        const totalDuration = this.randomDuration();
        data[date] = {
          totalDuration,
          entries: [],
          humanize: this.humanizeDuration(totalDuration),
        };
      }
    }

    onDone(data)
  }
}
