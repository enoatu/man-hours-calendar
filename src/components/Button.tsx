type ButtonProps = {
  className?: string,
  children?: React.ReactNode,
  onClick: () => void,
}

// w-full など後から指定する
// margin などは className で指定する
export const Button = ({ className, children, onClick }:ButtonProps ) => (
  <button className={"py-2 border border-gray-400 text-center hover:bg-gray-400 hover:text-white " + className}
    onClick={() => onClick()}>
    {children}
  </button>
)
