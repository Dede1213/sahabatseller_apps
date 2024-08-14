import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const generatePageNumbers = () => {
    let startPage, endPage;
    if (totalPages <= 5) {
      // Show all pages if totalPages is less than or equal to 5
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate the range of page numbers to display
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }
    return [...Array(endPage - startPage + 1).keys()].map(i => startPage + i);
  };

  const pageNumbers = generatePageNumbers();

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Text style={styles.buttonText}>Previous</Text>
      </TouchableOpacity>

      {pageNumbers.map(page => (
        <TouchableOpacity
          key={page}
          style={[styles.pageButton, page === currentPage && styles.activePageButton]}
          onPress={() => onPageChange(page)}
        >
          <Text style={[styles.pageText, page === currentPage && styles.activePageText]}>{page}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  button: {
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#48a7f6',
  },
  pageButton: {
    padding: 10,
    marginHorizontal: 5,
  },
  activePageButton: {
    backgroundColor: '#1a7dcf',
    borderRadius: 5,
  },
  pageText: {
    fontSize: 16,
    color: '#48a7f6',
  },
  activePageText: {
    color: '#FFF',
  },
});

// const itemsPerPage = 10;
// const [currentPage, setCurrentPage] = useState(1);
//   const data = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

//   const totalPages = Math.ceil(data.length / itemsPerPage);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.itemContainer}>
//       <Text>{item}</Text>
//     </View>
//   );

//   const getCurrentPageData = () => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return data.slice(startIndex, endIndex);
//   };

{/* <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/> */}
export default Pagination;
