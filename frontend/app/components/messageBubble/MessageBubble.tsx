import {cn} from "@/lib/utils"

interface MessageBubbleProps {
  message: string;
  alignment: "left" | "right";
  className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  alignment,
  className,
}) => {
  const isLeftAligned = alignment === "left";

  return (
    <div
      className={cn(
        `flex items-start ${isLeftAligned ? "justify-start" : "justify-end"}`
      )}
    >
      <div
        className={`
           sm:max-w-[20rem] w-[10rem] py-[0.4375rem] pl-3 pr-[0.875rem] bg-[#FDF7D9] rounded-[1.125rem] shadow-md text-xs sm:text-[1rem] border-2 border-textColor-neutral
          ${isLeftAligned ? "rounded-bl-none" : "rounded-br-none"}
          ${
            isLeftAligned
              ? "after:left-0 after:-ml-2"
              : "after:right-0 after:-mr-2"
          }
          after:content-[''] after:absolute after:bottom-0 after:w-0 after:h-0
          after:border-t-[10px] after:border-t-textColor-neutral
          ${
            isLeftAligned
              ? "after:border-l-[10px] after:border-l-transparent"
              : "after:border-r-[10px] after:border-r-transparent"
          }
          ${className}
        `}
      >
        {message}
      </div>
    </div>
  );
};

export default MessageBubble;
