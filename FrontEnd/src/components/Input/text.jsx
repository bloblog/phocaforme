const TextInput = ({ id, value, onChange, placeholder }) => {
  return (
    <textarea
      className={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ whiteSpace: "pre-line" }}
    />
  );
};

export default TextInput;
