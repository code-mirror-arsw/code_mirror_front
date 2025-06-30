
import ProfileCard from "@/components/profile/ProfileCard";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-lightmode-background dark:bg-background
                    text-lightmode-text dark:text-light transition-colors">
      <ProfileCard />
    </div>
  );
}
