import { Button } from "@nextui-org/react";
import { LucideIcon } from "lucide-react";
import React from "react";

interface CustomButtonProps {
  isDisabled?: boolean;
  icon?: LucideIcon;
  className: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function CustomButton({
  isDisabled,
  icon: Icon,
  className,
  type,
  onClick,
  children,
}: CustomButtonProps) {
  return (
    <Button
      isDisabled={isDisabled}
      className={className}
      onClick={onClick}
      type={type}
    >
      {Icon && <Icon />}
      {children} 
    </Button>
  );
}