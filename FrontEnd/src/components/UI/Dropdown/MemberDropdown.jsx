// 게시글 생성
import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import { Box, TextField, Autocomplete } from "@mui/material";

const MemberDropdown = ({
  isProfile,
  selectedGroup,
  defaultMember,
  onChange,
}) => {
  const [value, setValue] = useState(defaultMember);

  const handleChange = (event, newValue) => {
    const selectedMember = newValue ? newValue : null;
    setValue(newValue);
    onChange(selectedMember);
  };

  const [memberItems, setMemberItems] = useState([]);

  useEffect(() => {
    setValue(null);
    onChange(null);

    const fetchData = async () => {
      if (selectedGroup) {
        try {
          const response = await axios.get(
            process.env.REACT_APP_API_URL +
              `idol/member/${selectedGroup.idolGroupId}`,
            {
              withCredentials: true,
            }
          );
          setMemberItems(response.data);
        } catch (error) {
          console.error("멤버 세팅 오류:", error);
        }
      }
    };

    fetchData();
  }, [selectedGroup]);

  return (
    <div>
      <Autocomplete
        value={value}
        onChange={handleChange}
        size="small"
        id="group-dropdown"
        options={memberItems}
        // isOptionEqualToValue={(option, value) => option.idolMemberId === value.idolMemberId}
        getOptionLabel={(option) => option.idolName}
        // sx={{ width: "12rem" }}
        // 검색이랑 스타일 맞추려면 이거
        sx={{
          width: isProfile ? "12rem" : "38vw",
        }}
        noOptionsText="그룹을 선택하세요"
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            {option.idolName}
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

export default MemberDropdown;
