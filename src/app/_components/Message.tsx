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
          <div className="mr-10 flex h-full items-center">
            <span
              className={`font-regular flex h-7 w-7 items-center justify-center text-lg ${
                role === "assistant"
                  ? "border border-black"
                  : "bg-black text-white"
              }`}
            >
              {role === "assistant" ? "s" : "k"}
            </span>
          </div>
          <p
            style={{ whiteSpace: "pre-wrap" }}
            className="pr-3 text-sm leading-relaxed"
          >
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
