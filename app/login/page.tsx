import LoginInteractive from "./componnets/loginInteractive";

export const metadata = {
  title: 'Sign In - FashionHub Commerce',
  description: 'Sign in to your FashionHub account to access personalized features, cart data, and order history. Secure authentication with email and password.',
};

export default function UserLoginPage() {
  return <LoginInteractive />;
}