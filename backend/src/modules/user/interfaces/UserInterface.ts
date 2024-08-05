import { Room } from '../entities/room.entity';

interface UserInterface {
  id: string;

  email: string;

  first_name: string;

  last_name: string;

  password: string;

  rooms?: Room[];

  created_at: Date;

  updated_at: Date;

  hashPassword?: () => void;
}

export default UserInterface;
