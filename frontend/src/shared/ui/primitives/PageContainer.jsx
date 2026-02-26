const PageContainer = ({ className = "", children }) => {
  return <div className={`mx-auto w-full max-w-5xl px-4 py-6 ${className}`}>{children}</div>;
};

export default PageContainer;

