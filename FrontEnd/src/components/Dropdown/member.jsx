// 게시글 생성
import * as React from "react";
import { useState, useEffect } from "react";

import { Box, TextField, Autocomplete } from "@mui/material";
import { getIdolMember } from "@/api/idolinfo";

const MemberDropdown = ({
  isProfile,
  selectedGroup,
  defaultMember,
  onChange,
}) => {
  const [value, setValue] = useState(defaultMember);
  const [memberItems, setMemberItems] = useState([]);

  const handleChange = (event, newValue) => {
    const selectedMember = newValue ? newValue : null;
    setValue(newValue);
    onChange(selectedMember);
  };

  useEffect(() => {
    setValue(null);
    onChange(null);

    if (selectedGroup) {
      getIdolMember(
        selectedGroup.idolGroupId,
        (data) => setMemberItems(data.data),
        (error) => console.error("멤버 세팅 오류:", error)
      );
    }
  }, [selectedGroup]);

  return (
    <div>
      <Autocomplete
        value={value}
        onChange={handleChange}
        size="small"
        id="group-dropdown"
        options={memberItems}
        isOptionEqualToValue={(option, value) =>
          option.idolMemberId === value.idolMemberId
        }
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
