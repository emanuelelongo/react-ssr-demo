export default function fetchComponentData(dispatch, components) {
  const requirements = components.reduce( (prev, current) => {
    return current ? (current.requirements || []).concat(prev) : prev;
  }, []);
  const promises = requirements.map(requirement => dispatch(requirement()));
  return Promise.all(promises);
}