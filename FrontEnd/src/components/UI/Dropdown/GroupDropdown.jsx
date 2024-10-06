// 게시물 생성용
import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField, Autocomplete } from "@mui/material";

const GroupDropdown = ({ isProfile, defaultGroup, onChange }) => {
  const [groupItems, setGroupItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.REACT_APP_API_URL + "idol/group",
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

  const [value, setValue] = useState(defaultGroup);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div>
      <Autocomplete
        value={value}
        onChange={handleChange}
        size="small"
        id="group-dropdown"
        options={groupItems}
        getOptionLabel={(option) =>
          `${option.idolGroupNameKr} (${option.idolGroupNameEng})`
        }
        // isOptionEqualToValue={(option) => option.idolGroupNameKr}

        // 검색이랑 모양 똑같이 할거면 스타일 밑에걸로
        sx={{
          width: isProfile ? "12rem" : "80vw",
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
    </div>
  );
};

export default GroupDropdown;
