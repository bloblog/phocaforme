import React, { useState, useEffect } from "react";

import { Box, TextField, Autocomplete } from "@mui/material";

const TypeDropdown2 = ({ defaultCardType, onChange }) => {
  const TypeItems = [
    { value: "앨범포카", label: "앨범포카" },
    { value: "미공포", label: "미공포" },
    { value: "럭키드로우", label: "럭키드로우" },
    { value: "공방포카", label: "공방포카" },
    { value: "기타", label: "기타" },
  ];

  const [value, setValue] = useState(defaultCardType);

  useEffect(() => {
    if (defaultCardType) {
      setValue(defaultCardType);
      onChange(defaultCardType);
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      size="small"
      id="card-type-dropdown"
      options={TypeItems}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      sx={{
        width: "80vw",
      }}
      noOptionsText="해당 분류가 없습니다"
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          fullWidth
          placeholder="선택하세요"
          InputProps={{
            ...params.InputProps,
          }}
        />
      )}
    />
  );
};

export default TypeDropdown2;
