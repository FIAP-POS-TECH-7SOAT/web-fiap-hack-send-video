import { ReactNode, useRef, useState } from "react";
import { Button } from "@nextui-org/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FormStepType } from "@/types/form-type";
import { v4 } from "uuid";



type FormStepTabType={
  
  
  children:ReactNode[]
  
}
export default function FormStepsTabHeader({children}:FormStepTabType) {
  const [activeTab, setActiveTab] = useState(0);
  
  
  const tabsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  
  const scrollTabs = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 150; // Pixels a serem rolados
      const currentScroll = tabsRef.current.scrollLeft;
      const newScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      tabsRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  const haMany = containerRef.current && tabsRef.current && containerRef.current?.scrollWidth <tabsRef.current?.scrollWidth;
  return (
    <div className="flex  w-full flex-col" ref={containerRef}>
      <div className="flex flex-col ">
        {
          haMany && 
          <div className="flex mb-3 gap-3">
          
          <Button
            isIconOnly
            radius="full"
            onPress={() => scrollTabs("left")}
            
            variant="flat"
          >
            <IoIosArrowBack />
          </Button>
          <Button
            isIconOnly
            radius="full"
            onPress={() => scrollTabs("right")}
            variant="flat"
          >
            <IoIosArrowForward/>
          </Button>

        </div>
        }
        <div
          ref={tabsRef}
          className="flex overflow-x-hidden no-scrollbar scroll-smooth space-x-2"
        >
          {children.map((item,index) => (
            <Button
              key={v4()}
              
              
              color={activeTab === index ? "primary" : "default"}
              onPress={() => setActiveTab(index)}
              className="whitespace-nowrap shrink-0"
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
