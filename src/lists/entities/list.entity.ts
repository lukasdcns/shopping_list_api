import { ApiProperty } from '@nestjs/swagger';
import { List } from '@prisma/client';
import { UserEntity } from 'src/users/entities/user.entity';

export class ListEntity implements List {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdByUserId: string;

  @ApiProperty()
  createdById: string;

  @ApiProperty({ required: false, type: UserEntity })
  createdBy?: UserEntity;

  constructor({ createdBy, ...data }: Partial<ListEntity>) {
    Object.assign(this, data);

    if (createdBy) {
      this.createdBy = new UserEntity(createdBy);
    }
  }
}
