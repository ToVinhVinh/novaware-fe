/**
 * Format số tiền thành định dạng VNĐ
 * @param {number|string} price - Giá cần format
 * @returns {string} - Giá đã được format (ví dụ: "1.000 đ", "100.000 đ")
 * 
 * @example
 * formatPriceVN(1000) // "1.000 đ"
 * formatPriceVN(100000) // "100.000 đ"
 * formatPriceVN(1234567) // "1.234.567 đ"
 */
export const formatPriceVN = (price) => {
  // Chuyển đổi về số nếu là string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Kiểm tra nếu không phải số hợp lệ
  if (isNaN(numPrice) || numPrice === null || numPrice === undefined) {
    return '0 đ';
  }
  
  // Làm tròn về số nguyên và chuyển đổi thành string
  const roundedPrice = Math.round(numPrice);
  const priceString = roundedPrice.toString();
  
  // Format với dấu chấm làm phân cách hàng nghìn
  const formattedPrice = priceString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formattedPrice} đ`;
};

export default formatPriceVN;

