export const paginate = async (
  model,
  query,
  page = 1,
  limit = 10,
  sort = {}
) => {
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort,
  };

  const result = await model.paginate(query, options);

  return {
    data: result.docs,
    page: result.page,
    limit: result.limit,
    total: result.totalDocs,
    hasNextPage: result.hasNextPage,
    hasPreviousPage: result.hasPrevPage,
  };
};
