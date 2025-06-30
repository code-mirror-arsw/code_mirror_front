import { Input } from "@heroui/input";

interface RegisterInputProps {
  name: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RegisterInput({
  name,
  placeholder,
  type = "text",
  value,
  onChange
}: RegisterInputProps) {
  return (
    <Input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
  );
}
