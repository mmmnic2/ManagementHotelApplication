import PropTypes from "prop-types";
const RoomPaginator = ({ currentPage, totalPages, onPageChange }) => {
  //let totalPages = 5;
  //let resultArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  // Kết quả là một mảng [1, 2, 3, 4, 5]
  const pageNumber = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav>
      <ul className="pagination justify-content-center">
        {pageNumber.map((pageNumber) => (
          <li
            key={pageNumber}
            className={`page-item ${
              currentPage === pageNumber ? "active" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
RoomPaginator.propTypes = {
  currentPage: PropTypes.any,
  totalPages: PropTypes.any,
  onPageChange: PropTypes.any,
};
export default RoomPaginator;
