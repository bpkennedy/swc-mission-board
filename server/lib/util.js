export const stripAnonymousMissions = (missions) => {
  return missions.map(mission => {
    if (mission.anonymous === true) {
      return { ...mission, created_by: null }
    }
    return mission
  })
}