const generateOrderId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `FEX-${timestamp}-${randomStr}`;
};

module.exports = generateOrderId;
