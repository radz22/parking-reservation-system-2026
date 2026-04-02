interface FormSuccessProps {
  message?: string | React.ReactNode;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      {typeof message === 'string' ? <p>{message}</p> : message}
    </div>
  );
};
