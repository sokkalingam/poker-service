import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { TableService } from './table.service';
import { TableRequest } from '../model/TableRequest';

@Controller("table")
export class TableController {

  constructor(private readonly tableService: TableService) {
  }

  @Post("new")
  @UseInterceptors(ClassSerializerInterceptor)
  getNewTable(@Body() body: TableRequest): { tableId: number } {
    return this.tableService.getNewTable(body)
  }

}