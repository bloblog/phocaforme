import * as React from "react";
import { useState } from "react";

import { Box, TextField, Autocomplete } from "@mui/material";

const TypeDropdown = ({ defaultCardType, onChange }) => {
  const TypeItems = [
    { value: "앨범포카", label: "앨범포카" },
    { value: "미공포", label: "미공포" },
    { value: "럭키드로우", label: "럭키드로우" },
    { value: "공방포카", label: "공방포카" },
    { value: "기타", label: "기타" },
  ];

  const [value, setValue] = useState(defaultCardType);

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
      sx={{ width: "100%" }}
      noOptionsText="해당 분류가 없습니다"
      renderOption={(props, option) => {
        const { key, ...restProps } = props;
        const { label } = option;
        return (
          <Box
            component="li"
            key={label}
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...restProps}
          >
            {label}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
          }}
        />
      )}
    />
  );
};

export default TypeDropdown;
