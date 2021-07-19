export const formatGithubFollowers = data => {
  const formattedData = data.map(follower => ({
    id: follower.id,
    login: follower.login,
    avatarUrl: follower.avatar_url,
    profileUrl: follower.url
  }))

  return formattedData
}
