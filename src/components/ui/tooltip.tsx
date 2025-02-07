import { Tooltip } from "@nextui-org/react";
import React from "react";

interface TipProps {
  icon?: React.ComponentType;
  content: string;
  placement?: "right" | "left" | "top" | "bottom";
  showArrow?:  boolean;
  children?: React.ReactNode;
}

export default function Tip({
  icon: Icon,
  content,
  placement,
  showArrow = true,
  children,
}: TipProps) {
  return (
    <Tooltip
      content={content}
      placement={placement}
      showArrow={showArrow}
    >
      <span className="inline-flex items-center cursor-pointer">
        {Icon && <Icon />}
        {children}
      </span>
    </Tooltip>
  );
}