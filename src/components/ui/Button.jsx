function Button({ children, onClick, className }) {
    return (
      <button
        onClick={onClick}
        className={`bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-500 transition ${className}`}
      >
        {children}
      </button>
    );
  }
  
  export default Button;
  