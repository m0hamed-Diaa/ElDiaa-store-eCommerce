import { FcTodoList } from "react-icons/fc";

interface IProps {
  isLoading: boolean;
}

const BodyBefore = ({ isLoading }: IProps) => {
  return (
    <div
      className="
        fixed top-0 left-0 w-full h-screen 
        z-99999 text-[30px] 
        flex justify-center items-center flex-col
        bg-[rgba(0,4,130,0.96)]
        font-[cairo]
        text-[#847C7C]
        backdrop-blur-sm
        transition-all duration-300 
        pointer-events-none
        space-y-3
      "
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      <FcTodoList size={100} />
      To Do List App
    </div>
  );
};

export default BodyBefore;
