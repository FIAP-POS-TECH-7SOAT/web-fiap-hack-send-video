import { Input } from "@nextui-org/react";
import React, { useState, forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import PasswordVisibilityToggle from "./helpers/passwordVisibilityToggle";

interface InputFieldProps {
  label: string;
  type: string;
  isClearable?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  className?: string;
  iconEnd?: LucideIcon;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    {
      label,
      type,
      isClearable = false,
      isDisabled = false,
      isRequired = false,
      className = "",
      iconEnd: IconEnd,
      ...props
    },
    ref
  ) {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
      <div className="flex items-center space-x-2">
        <Input
          ref={ref}
          isClearable={isClearable}
          isDisabled={isDisabled}
          isRequired={isRequired}
          type={type === "password" && isVisible ? "text" : type}
          label={label}
          className={`rounded-lg border ${className}`}
          endContent={
            type === "password" ? (
              <PasswordVisibilityToggle
                isVisible={isVisible}
                toggleVisibility={toggleVisibility}
              />
            ) : (
              IconEnd && <IconEnd className="text-2xl text-default-400" />
            )
          }
          {...props}
        />
      </div>
    );
  }
);

export default InputField;
