import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseGuards } from '@nestjs/common';
import { CvService } from '../services/cv.service';
import { CreateCvDto } from '../dto/create-cv.dto';
import { UpdateCvDto } from '../dto/update-cv.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataParserInterceptor } from '../interceptors/form-data-parser.interceptor';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

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
  ) {
    return this.cvService.findAllByRole(user);
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
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
    @GetUser() user: any,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    if (file) {
      updateCvDto.path = `/uploads/${file.filename}`;
    }

    return this.cvService.updateWithUser(+id, updateCvDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string, 
    @GetUser() user: any
  ) {
    return this.cvService.removeWithUser(+id, user);
  }
}
