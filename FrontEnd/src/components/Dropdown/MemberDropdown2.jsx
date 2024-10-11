import * as React from "react";
import { useState, useEffect } from "react";

import { Box, TextField, Autocomplete } from "@mui/material";
import { getIdolMember } from "../../api/idolinfo";

const MemberDropdown2 = ({
  isProfile,
  selectedGroup,
  defaultMember,
  onChange,
}) => {
  const [value, setValue] = useState(defaultMember);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  const [memberItems, setMemberItems] = useState([]);

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
    <Autocomplete
      value={value}
      onChange={handleChange}
      size="small"
      id="member-dropdown"
      options={memberItems}
      // isOptionEqualToValue={(option, value) => option.idolMemberId === value.idolMemberId}
      getOptionLabel={(option) => option.idolName}
      sx={{
        width: isProfile ? "50vw" : "100%",
      }}
      noOptionsText={
        selectedGroup ? "해당 멤버가 없습니다" : "그룹을 선택해주세요"
      }
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
  );
};

export default MemberDropdown2;
