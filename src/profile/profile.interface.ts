export interface ProfileData {
  username: string;
  bio: string;
  image?: string;
  following?: boolean;
}
export interface IProfile {
  profile: ProfileData;
}
