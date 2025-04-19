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
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataParserInterceptor } from './interceptors/form-data-parser.interceptor';
import { FilterCvDto } from './dto/filter-cv.dto';

@Controller({
  path: 'cv',
  version: '1',
})
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file'),
    FormDataParserInterceptor
  )
  async create(
    @Body() createCvDto: CreateCvDto,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    if (file) {
      createCvDto.path = `/uploads/${file.filename}`;
    } else {
      createCvDto.path = '/default/no-image.png';
    }

    return this.cvService.create(createCvDto);
  }

  @Get()
  findAll(
    @Query() filterQuery: FilterCvDto
  ) {
    return this.cvService.findAll(filterQuery);
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
