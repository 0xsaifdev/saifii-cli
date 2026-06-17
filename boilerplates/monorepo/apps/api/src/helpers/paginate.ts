interface PaginateOptions {
  total: number;
  page: number;
  limit: number;
}

export const paginate = <T>(data: T[], { total, page, limit }: PaginateOptions) => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
