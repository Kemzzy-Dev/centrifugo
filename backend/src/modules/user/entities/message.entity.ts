import { AbstractBaseEntity } from 'src/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity({ name: 'messages' })
export default class Message extends AbstractBaseEntity {
  @ManyToOne(() => Room, room => room.messages)
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room: Room;

  @ManyToOne(() => User, user => user.messages)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({ type: 'text' })
  content: string;
}
