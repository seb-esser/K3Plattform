class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

function requireFields(body, fields) {
  const missing = fields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || String(value).trim() === '';
  });
  if (missing.length > 0) {
    throw new ValidationError(`Missing required field(s): ${missing.join(', ')}`);
  }
}

function parseBool(value) {
  if (value === undefined || value === null) return false;
  return value === true || value === 'true' || value === '1' || value === 'on';
}

function parseNullableFloat(value) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new ValidationError(`Invalid number: ${value}`);
  }
  return parsed;
}

module.exports = { ValidationError, requireFields, parseBool, parseNullableFloat };
