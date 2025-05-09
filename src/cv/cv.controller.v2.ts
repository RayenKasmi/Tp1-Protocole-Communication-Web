import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Request, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CvService } from './services/cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataParserInterceptor } from './interceptors/form-data-parser.interceptor';
import { UserService } from '../user/user.service';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller({
    path: 'cv',
    version: '2',
})
export class CvControllerV2 {
  constructor(
    private readonly cvService: CvService,
    private readonly userService: UserService,
) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file'),
    FormDataParserInterceptor
  )
  async create(
    @Body() createCvDto: CreateCvDto,
    @Request() req,
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
  findAll() {
    return this.cvService.findAll();
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
    @Request() req,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    const cv = await this.cvService.findOne(+id);
    if (!cv) {
      throw new NotFoundException(`CV with ID ${id} not found`);
    }
    if (cv.user.id !== req.userId) {
        throw new ForbiddenException('You can only update your own CVs');
    }
    if (file) {
      updateCvDto.path = `/uploads/${file.filename}`;
    }

    return this.cvService.update(+id, updateCvDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req,
) {
    const cv = await this.cvService.findOne(+id);
    if (!cv) {
      throw new NotFoundException(`CV with ID ${id} not found`);
    }
    if (cv.user.id !== req.userId) {
        throw new ForbiddenException('You can only delete your own CVs');
      }
    return this.cvService.remove(+id);
  }
}
