import { LoginForm } from "./LoginForm";
import { Logo } from "./Logo";

export const AuthCard = () => {
  return (
    <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-card">
      <div className="flex justify-center mb-6">
        <Logo />
      </div>
      <LoginForm />
    </div>
  );
};
