// 100 Orders for Eyes Optical Management System
// Note: customer, product, and prescription IDs will be set dynamically in seed script

const orderStatuses = ['pending', 'confirmed', 'processing', 'ready', 'shipped', 'delivered', 'cancelled'];
const paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
const paymentMethods = ['cash', 'card', 'online', 'insurance'];

export const generateOrders = (customerIds, productIds, prescriptionIds) => {
  const orders = [];
  const usedOrderNumbers = new Set();
  
  for (let i = 0; i < 100; i++) {
    const customerId = customerIds[Math.floor(Math.random() * customerIds.length)];
    const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
    const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    
    // Generate order number
    const timestamp = Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000); // Random time in last year
    let orderNumber = `ORD-${timestamp}-${String(i + 1).padStart(4, '0')}`;
    let counter = 1;
    while (usedOrderNumbers.has(orderNumber)) {
      orderNumber = `ORD-${timestamp}-${String(i + 1000 + counter).padStart(4, '0')}`;
      counter++;
    }
    usedOrderNumbers.add(orderNumber);
    
    // Generate 1-4 items per order
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const items = [];
    let subtotal = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const productId = productIds[Math.floor(Math.random() * productIds.length)];
      const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 items
      const price = Math.floor(Math.random() * 400) + 50; // $50-$450
      
      // 30% chance to have prescription
      const prescriptionId = Math.random() > 0.7 && prescriptionIds.length > 0
        ? prescriptionIds[Math.floor(Math.random() * prescriptionIds.length)]
        : null;
      
      items.push({
        product: productId,
        quantity,
        price,
        prescription: prescriptionId
      });
      
      subtotal += price * quantity;
    }
    
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
    const total = subtotal + tax + shipping;
    
    // Generate order date (within last year)
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 365));
    
    // Delivered date (if status is delivered)
    const deliveredAt = status === 'delivered' 
      ? new Date(orderDate.getTime() + Math.floor(Math.random() * 14 + 1) * 24 * 60 * 60 * 1000) // 1-14 days later
      : null;
    
    orders.push({
      orderNumber,
      customer: customerId,
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      total: Math.round(total * 100) / 100,
      status,
      paymentStatus,
      paymentMethod,
      shippingAddress: {
        street: `${Math.floor(Math.random() * 9999) + 1} Main St`,
        city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
        state: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
        zipCode: String(Math.floor(Math.random() * 90000 + 10000)),
        phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`
      },
      notes: Math.random() > 0.6 ? [
        'Handle with care',
        'Gift wrapping requested',
        'Rush delivery',
        'Leave at door',
        'Contact before delivery',
        'Special instructions provided'
      ][Math.floor(Math.random() * 6)] : null,
      deliveredAt,
      createdAt: orderDate,
      updatedAt: orderDate
    });
  }
  
  return orders;
};

