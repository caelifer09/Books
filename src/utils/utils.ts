export type Pagination = {
    total_records: number;
    current_page: number;
    total_pages: number;
    next_page: number | null;
    prev_page: number | null;
}

export const pageCalc = (totalRecords: number, page: string, pagesize: string): Pagination => {
    const currentPage: number = parseInt(page as string)
    const totalPage: number = Math.ceil(totalRecords/parseInt(pagesize as string))
    let nextPage: number, prevPage : number
    nextPage = currentPage < totalPage ? currentPage + 1 : currentPage
    prevPage = currentPage > 1 ? currentPage - 1 : currentPage
    return  {
        "total_records": totalRecords,
        "current_page": parseInt(page as string),
        "total_pages": totalPage,
        "next_page": nextPage === parseInt(page as string) ? null : nextPage,
        "prev_page": prevPage === parseInt(page as string) ? null : prevPage
    }
}