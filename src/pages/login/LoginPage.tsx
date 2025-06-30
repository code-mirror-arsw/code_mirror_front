import { AuthCard } from '../../components/login/AuthCard';
import { LoginForm } from "../../components/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lightmode-background dark:bg-background 
    text-lightmode-text dark:text-light transition-colors duration-300 px-4">
      <AuthCard>
        <LoginForm />
      </AuthCard>
    </div>
  );
}

