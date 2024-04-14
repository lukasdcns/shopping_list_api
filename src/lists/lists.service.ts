import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UUID } from 'crypto';

@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService) {}

  create(createListDto: CreateListDto) {
    return this.prisma.list.create({ data: createListDto });
  }

  findAll() {
    return this.prisma.list.findMany();
  }

  findOne(id: UUID) {
    return this.prisma.list.findUnique({
      where: { id },
      include: { createdBy: true },
    });
  }

  update(id: UUID, updateListDto: UpdateListDto) {
    return this.prisma.list.update({
      where: { id },
      data: updateListDto,
    });
  }

  remove(id: UUID) {
    return this.prisma.list.delete({ where: { id } });
  }
}
