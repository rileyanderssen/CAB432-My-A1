const ITEMS_PER_PAGE = 5;

function DeterminePaginationBounds(pageNumber) {
    const upperBound = pageNumber * ITEMS_PER_PAGE - 1;
    const lowerBound = pageNumber * ITEMS_PER_PAGE - 5;

    return { upperBound, lowerBound };
}

function DeterminePaginationResponse(pageNumber, len) {
    const from = pageNumber * ITEMS_PER_PAGE - 4;
    let to = pageNumber * ITEMS_PER_PAGE;
    const mod = len % 5;
    if (mod !== 0) {
        to = (pageNumber - 1) * ITEMS_PER_PAGE + mod;
    }

    return {
        pageNumber: pageNumber,
        itemsInPage: len,
        from: from,
        to: to
    };
}

module.exports = {
    DeterminePaginationBounds,
    DeterminePaginationResponse
}