"use client";

type MessageProps = {
  message: {
    content: string;
    role: string;
    createdAt: Date;
    id: string;
  };
};

export default function Message({ message }: MessageProps): JSX.Element {
  const { content, role } = message;

  return (
    <div
      className={`flex w-full justify-center ${
        role === "assistant" ? "bg-[#FEF1EA]" : "bg-white"
      }`}
    >
      <div className="w-full max-w-2xl py-14">
        <div className="flex items-center">
          <div className="flex h-full items-center mr-10">
            <span className={`text-lg font-regular w-7 h-7 flex justify-center items-center ${role === 'assistant' ? 'border-black border' : 'text-white bg-black'}`}>
                {role === "assistant" ? "s" : "k"}
            </span>
          </div>
          <p className="text-sm leading-relaxed pr-3">
          {content}
          </p>
        </div>
        
      </div>
    </div>
  );
}
