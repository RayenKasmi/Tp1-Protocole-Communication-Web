import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataParserInterceptor } from './interceptors/form-data-parser.interceptor';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { FilterCvDto } from './dto/filter-cv.dto';

@Controller({
  path: 'cv',
  version: '1',
})
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file'),
    FormDataParserInterceptor
  )
  async create(
    @Body() createCvDto: CreateCvDto,
    @GetUser() user: any,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    if (file) {
      createCvDto.path = `/uploads/${file.filename}`;
    } else {
      createCvDto.path = '/default/no-image.png';
    }

    return this.cvService.createWithUser(createCvDto, user);
  }

  
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @GetUser() user: any,
    @Query() filter: FilterCvDto,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.cvService.findAllByCriteria(user, filter, paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cvService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file'),
    FormDataParserInterceptor
  )
  async update(
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    if (file) {
      updateCvDto.path = `/uploads/${file.filename}`;
    }

    return this.cvService.update(+id, updateCvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cvService.remove(+id);
  }
}
