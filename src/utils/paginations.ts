export function applyPaginations<T>(objs: T[], page: number, limit: number): T[] {
    return objs.slice(page * limit, page * limit + limit);
}
