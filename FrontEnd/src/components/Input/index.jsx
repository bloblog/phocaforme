const Input = ({ id, value, onChange, placeholder }) => {
  return (
    <input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      variant="outlined"
    />
  );
};

export default Input;
