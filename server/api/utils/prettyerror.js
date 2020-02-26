module.exports = error => {
  const errors = {};
  const pattern = /"([^"]+)"/;

  error.details.forEach(item => {
    errors[item.context.key] = (item.message || '').replace(pattern, '$1');
  });

  return errors;
};
