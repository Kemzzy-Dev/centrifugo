import { AbstractBaseEntity } from 'src/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import Message from './message.entity';

@Entity({ name: 'rooms' })
export class Room extends AbstractBaseEntity {
  @Column()
  name: string;

  @Column()
  version: number;

  @OneToOne(() => Message)
  @JoinColumn()
  last_message: Message;

  @Column()
  bumpedAt: number;

  @ManyToMany(() => User, user => user.rooms)
  members: User[];

  @OneToMany(() => Message, message => message.room)
  messages: Message[];
}
