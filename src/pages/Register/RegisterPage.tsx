import RegisterForm from "../../components/auth/Register/RegisterForm";
import { AuthCard } from '../../components/auth/login/AuthCard';


export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lightmode-background dark:bg-background text-lightmode-text dark:text-light transition-colors duration-300 px-4">
    
      <AuthCard>
        <RegisterForm />
      </AuthCard>
    </div>
  );
}
