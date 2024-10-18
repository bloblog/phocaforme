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

  images.forEach((image) => {
    newPost.append(`photos`, image);
  });
  newPost.append("title", title);
  newPost.append("groupId", selectedGroup);

  ownIdolMembers.forEach((member) => {
    newPost.append("ownIdolMembers", member.idolMemberId);
  });

  findIdolMembers.forEach((member) => {
    newPost.append("findIdolMembers", member.idolMemberId);
  });

  newPost.append("cardType", cardType);

  const encodedContent = encodeURIComponent(content);
  newPost.append("content", encodedContent);

  return newPost;
};

export default makeFormData;
