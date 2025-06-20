import { ThemeToggle } from '../../components/changeTheme/ThemeToggle';
import { LoginForm } from '../../components/login/LoginForm';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-lightmode-background dark:bg-background text-lightmode-text dark:text-light transition-colors duration-300 flex items-center justify-center px-4">
      <ThemeToggle />

      <div className="w-full max-w-md p-6 rounded-xl bg-lightmode-card dark:bg-card shadow-xl">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="CodeMirror Logo"
            className="h-16 object-contain"
          />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
