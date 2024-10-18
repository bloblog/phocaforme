const makeFormData = (
  images,
  title,
  selectedGroup,
  ownIdolMembers,
  findIdolMembers,
  cardType,
  content
) => {
  const newPost = new FormData();
  console.log(ownIdolMembers);

  images.forEach((image) => {
    newPost.append(`photos`, image);
  });
  newPost.append("title", title);
  newPost.append("groupId", selectedGroup);

  ownIdolMembers.forEach((member) => {
    newPost.append("ownIdolMembers", member.idolMemberId || member.id);
  });

  findIdolMembers.forEach((member) => {
    newPost.append("findIdolMembers", member.idolMemberId || member.id);
  });

  newPost.append("cardType", cardType);

  const encodedContent = encodeURIComponent(content);
  newPost.append("content", encodedContent);

  return newPost;
};

export default makeFormData;
