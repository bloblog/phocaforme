import React, { useEffect, useState } from "react";

import { Box, TextField, Autocomplete } from "@mui/material";

const TypeDropdown = ({ defaultCardType, onChange }) => {
  const TypeItems = ["앨범포카", "미공포", "럭키드로우", "공방포카", "기타"];
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(defaultCardType);
  }, [defaultCardType]);

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
      isOptionEqualToValue={(option, value) => option === value}
      sx={{ width: "100%" }}
      noOptionsText="해당 분류가 없습니다"
      renderOption={(props, option) => {
        const { key, ...restProps } = props;
        return (
          <Box
            component="li"
            key={option}
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...restProps}
          >
            {option}
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
