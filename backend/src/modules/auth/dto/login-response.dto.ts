export class LoginResponseDto {
  status_code: number;
  message: string;
  data: {
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
    };
  };

  token: {
    access_token: string;
    centrifugo_token: string;
  };
}
