export interface AuthenticatedUser {
  id: string;
  email: string;
  apiEnabled: boolean;
}
export interface JwtPayload {
  sub: string;
  email: string;
  apiEnabled: boolean;
  roles?: string[];
}
