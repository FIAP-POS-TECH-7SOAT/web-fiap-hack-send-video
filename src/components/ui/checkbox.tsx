"use client";

import { useState } from "react";
import { Checkbox } from "@nextui-org/react";

const ToggleSwitch = ({
  initialState = false,
  onToggle,
  activeText = "Ativar",
  inactiveText = "Desativar",
}: {
  initialState?: boolean;
  onToggle?: (isActive: boolean) => void;
  activeText: string;
  inactiveText: string;
}) => {
  const [isActive, setIsActive] = useState(initialState);

  const toggleCheckbox = () => {
    setIsActive((prev) => !prev);
    if (onToggle) {
      onToggle(!isActive);
    }
  };

  return (
    <Checkbox onChange={toggleCheckbox}>
      {isActive ? activeText : inactiveText}
    </Checkbox>
  );
};

export default ToggleSwitch;
