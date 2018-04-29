import { Controller, Get, Post, Res, Body, HttpStatus } from '@nestjs/common';

@Controller('aaa')
export class AppController {
  @Post()
  create(@Res() res) {
    res.status(HttpStatus.CREATED).send();
  }
  @Get()
  findAll(@Res() res) {
    res.status(HttpStatus.OK).json([]);
  }
}
