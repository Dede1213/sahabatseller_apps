import axios from 'axios';

export const fetchData = async (url, options = {}) => {
  try {
    const response = await axios({
      method: options.method || 'get', // Default ke GET jika tidak ditentukan
      url: url,
      headers: options.headers || {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      data: options.data || null, // Data hanya untuk permintaan POST, PUT, PATCH
    });

    return response.data; // Mengembalikan data respons
  } catch (error) {
    // console.log('Error:', error);
    // console.log('Error Response:', error.response);
    // console.log('Error Response Data:', error.response.data);
    // console.log('Error Response Status:', error.response.status);
    // console.log('Error Response Headers:', error.response.headers);
    // console.log('Error Response Config:', error.response.config);
    // console.log('Error Request:', error.request);
    // console.log('Error Config:', error.config);
    if (error) {
      if (error.response) {
        if (error.response.data.message) {
          throw error.response.data;
        } else {
          error.message = "Terjadi kesalahan saat terhubung ke server.";
          throw error;
        }
      } else if (error.code == 401) {
        error.message = "Sesi login anda telah habis. silahkan logout dan login kembali.";
        throw error;
      } else {
        error.message = "Terjadi kesalahan saat terhubung ke server.";
        throw error;
      }
    } else {
      error.message = "Terjadi kesalahan saat terhubung ke server.";
      throw error;
    }
  }
};