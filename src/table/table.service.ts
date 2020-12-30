import { Injectable } from '@nestjs/common';
import { Table } from '../model/Table';
import { TableUtils } from './table.utils';

@Injectable()
export class TableService {

  // TODO: use an external cache service to keep ids centralized
  tableMap: Map<number, Table>

  constructor() {
    this.tableMap = new Map<number, Table>()
  }

  getNewTable(input): { tableId: number } {
    let tableId = TableUtils.generateTableId(this.tableMap)
    this.tableMap.set(tableId, TableUtils.getNewTable(input, tableId))
    return { tableId: tableId }
  }

}