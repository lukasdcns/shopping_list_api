import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { UUID } from 'crypto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListEntity } from './entities/list.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('lists')
@ApiTags('Lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  @ApiCreatedResponse({ type: ListEntity })
  async create(@Body(new ValidationPipe()) createListDto: CreateListDto) {
    return new ListEntity(await this.listsService.create(createListDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ListEntity, isArray: true })
  async findAll() {
    const lists = await this.listsService.findAll();
    return lists.map((list) => new ListEntity(list));
  }

  @Get(':id')
  @ApiOkResponse({ type: ListEntity })
  async findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    const list = await this.listsService.findOne(id);
    if (!list) {
      throw new NotFoundException('List not found');
    }
    return new ListEntity(await this.listsService.findOne(id));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ListEntity })
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body(new ValidationPipe()) updateListDto: UpdateListDto,
  ) {
    return new ListEntity(await this.listsService.update(id, updateListDto));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ListEntity })
  async remove(@Param('id', ParseUUIDPipe) id: UUID) {
    return new ListEntity(await this.listsService.remove(id));
  }
}
