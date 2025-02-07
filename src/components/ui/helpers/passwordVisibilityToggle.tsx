"use client";

import { Eye, EyeOff } from "lucide-react";
import React from "react";

interface PasswordVisibilityToggleProps {
  isVisible: boolean;
  toggleVisibility: () => void;
}

export default function PasswordVisibilityToggle({
  isVisible,
  toggleVisibility,
}:  PasswordVisibilityToggleProps) {
  return (
    <button
      className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
      type="button"
      onClick={toggleVisibility}
      aria-label="toggle password visibility"
    >
      {isVisible ? (
        <EyeOff className="text-2xl text-default-400" />
      ) : (
        <Eye className="text-2xl text-default-400" />
      )}
    </button>
  );
}