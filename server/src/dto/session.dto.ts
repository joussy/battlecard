export class SessionDto {
  email: string;
  name: string;
  picture: string;
  oauth?: {
    code_verifier: string;
    provider: string;
    state?: string;
  };
  user?: {
    id: string;
    email: string;
    apiEnabled: boolean;
  };
}

export interface BattlecardSessionRequest extends Request {
  session: SessionDto;
}
