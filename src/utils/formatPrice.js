export const formatPriceDollar = (price) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice) || numPrice === null || numPrice === undefined) {
    return '$0';
  }
  const usdPrice = numPrice / 25000;
  const roundedPrice = Math.round(usdPrice * 100) / 100;
  const formattedPrice = roundedPrice.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return `$${formattedPrice}`;
};

export default formatPriceDollar;

