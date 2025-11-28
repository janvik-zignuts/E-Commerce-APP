import RegistrationInteractive from "./components/registerIntractive";


export const metadata = {
  title: 'Create Account - FashionHub Commerce',
  description: 'Join FashionHub to access exclusive fashion collections, personalized recommendations, and seamless shopping experiences. Create your account today.',
};

export default function UserRegistrationPage() {
  const pageData = {
    title: 'Create Your Account',
    subtitle: 'Join FashionHub for exclusive access to the latest trends',
  };

  return (
    <>
      {/* <Header currentUser={null} cartCount={0} /> */}
      <RegistrationInteractive initialData={pageData} />
    </>
  );
}