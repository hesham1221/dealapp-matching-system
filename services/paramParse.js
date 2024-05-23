export const parseQueryParams = (
  query,
  options = {},
  schema = null,
  paginated = true,
  silent = false,
  deleteKeys = []
) => {
  const { page = 1, limit = 10, ...params } = query;
  let filters = params;
  if (schema) {
    const { error, value } = schema.validate(params, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const msg = `Validation error: ${error.details
        .map((x) => x.message)
        .join(", ")}`;
      if (!silent)
        throw new Error(JSON.stringify({ message: msg, status: 400 }));
    }
    filters = value;
  }
  const parsedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
    if (value) {
      acc[key] = isNaN(value) ? value : parseInt(value, 10);
    }
    return acc;
  }, {});
  deleteKeys.forEach((key) => delete parsedFilters[key]);
  return {
    query: { ...options, ...parsedFilters },
    ...(paginated && {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    }),
  };
};
