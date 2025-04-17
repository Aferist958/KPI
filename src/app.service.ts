import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
  private readonly data: any;
  constructor() {
    const path = join(__dirname, '..', 'KPI.json');
    this.data = JSON.parse(readFileSync(path, 'utf-8'));
  }
  getData(): object{
    const [day, month, year] = this.data.ReportingDate.split('.');
    const dayInt = Number(day)
    const currentDay = new Date().getDate();
    let deadLine = dayInt - currentDay;
    let day_string = ''
    const last_num = deadLine%10
    let MBO_approved = 0
    let MBO_done = 0
    let DI_approved = 0
    let DI_done = 0
    let MBO_fines = 0
    let DI_fines = 0


    if (deadLine < 0) {
      deadLine = 0
    }
    if (deadLine > 10 && [11, 12, 13, 14].includes(deadLine%100)) day_string =  'дней';
    if (last_num == 1) day_string = 'день';
    if ([2,3,4].includes(last_num)) day_string = 'дня';
    if ([5,6,7,8,9, 0].includes(last_num)) day_string = 'дней';

    for (let task of this.data.TaskList.Month) {
      if (task.SMARTTask == 'MБO') {
        if (task.Approved) {
          MBO_approved += 1
          if (task.Done) {
            MBO_done += 1
          }
        }
      } else if(task.SMARTTask == 'ДИ') {
        if (task.Approved) {
          DI_approved += 1
          if (task.Done) {
            DI_done += 1
          }
        }
      }
    }

    for (let fines of this.data.Penalties) {
      if (fines.Group == 'МБО') {
        MBO_fines += fines.Percent
      } else if (fines.Group == 'ДИ') {
        DI_fines += fines.Percent
      }
    }


    return {day_int: deadLine, day_string: day_string,
        MBO_approved: MBO_approved, MBO_done: MBO_done, DI_approved: DI_approved, DI_done: DI_done,
        MBO_fines: MBO_fines, DI_fines: DI_fines}
  }
}
