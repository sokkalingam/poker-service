import _ from 'lodash';
import { TableConfig } from './table.config';
import { Table } from '../model/Table';
import { TableRequest } from '../model/TableRequest';

export class TableUtils {

  static generateTableId(map: Map<number, Table>): number {
    let id = _.random(TableConfig.TABLE_ID_LOWER_BOUND, TableConfig.TABLE_ID_UPPER_BOUND)
    if (!map.has(id)) {
      return id
    }
    console.log(`Table ${id} is already taken, regenerating a new table id`)
    return this.generateTableId(map)
  }

  static getNewTable(input: TableRequest, id: number): Table {
    return new Table(id, input)
  }
}