import * as React from "react";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";

import { Box, TextField, Autocomplete } from "@mui/material";

const GroupDropdown2 = ({ defaultGroup, isProfile, onChange }) => {
  const [groupItems, setGroupItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_APP_API_URL + "idol/group",
          {
            withCredentials: true,
          }
        );
        setGroupItems(response.data);
      } catch (error) {
        console.error("그룹 세팅 오류:", error);
      }
    };

    fetchData();
  }, []);

  const user = useSelector((state) => state.user.user);
  const [value, setValue] = useState(isProfile ? null : defaultGroup);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      size="small"
      id="group-dropdown"
      options={groupItems}
      getOptionLabel={(option) =>
        `${option.idolGroupNameKr} (${option.idolGroupNameEng})`
      }
      isOptionEqualToValue={(option, value) =>
        option.idolGroupNameKr === value.idolGroupNameKr
      }
      sx={{
        width: isProfile ? "50vw" : "100%",
      }}
      noOptionsText="해당 그룹이 없습니다"
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          {`${option.idolGroupNameKr} (${option.idolGroupNameEng})`}
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
            startAdornment: (
              <React.Fragment>
                {params.InputProps.startAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default GroupDropdown2;
