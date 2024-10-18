// Post 의 모든 항목 다 있는지 체크

const isComplete = (post) => {
  const notCompleted = [];
  if (post.get("title") == null) {
    notCompleted.push("title");
  }
  if (post.get("groupId") == 0) {
    notCompleted.push("groupId");
  }
  if (
    post.get("ownIdolMembers") == null ||
    post.get("ownIdolMembers").length == 0
  ) {
    notCompleted.push("ownIdolMembers");
  }
  if (
    post.get("findIdolMembers") == null ||
    post.get("findIdolMembers").length == 0
  ) {
    notCompleted.push("findIdolMembers");
  }
  if (post.get("cardType") == "") {
    notCompleted.push("cardType");
  }
  if (post.get("content").trim() == "") {
    notCompleted.push("content");
  }
  return notCompleted;
};

export default isComplete;
