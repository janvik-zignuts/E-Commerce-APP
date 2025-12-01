import { AuthProvider } from "firebase/auth";

export interface SocialLoginOptionsProps {
  isLoading?: boolean;
}

export interface SocialProvider {
  name: 'Google' | 'Facebook';
  icon: 'google' | 'facebook';
  bgColor: string;
  textColor: string;
  borderColor: string;
  provider: AuthProvider;
}