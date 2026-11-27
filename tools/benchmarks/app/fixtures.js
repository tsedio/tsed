// Fixed payloads shared by the bench app and the runner (request bodies and expected responses).

const DATE = "2026-01-01T00:00:00.000Z";

function createItems(count, seed) {
  return Array.from({length: count}, (_, index) => ({
    sku: `SKU-${seed}-${index}`,
    quantity: (index % 5) + 1,
    price: 10 + (index % 7)
  }));
}

export function createOrder(id, itemCount) {
  return {
    id: `order-${id}`,
    customer: `customer-${id % 50}`,
    status: id % 2 ? "paid" : "pending",
    createdAt: DATE,
    items: createItems(itemCount, id)
  };
}

export function totalOf(order) {
  return order.items.reduce((total, item) => total + item.quantity * item.price, 0);
}

// body of POST /orders
export const ORDER_BODY = createOrder(1, 20);

export const ORDERS_SIZE = 500;

// GET /orders?size=500
export const ORDERS = Array.from({length: ORDERS_SIZE}, (_, index) => createOrder(index, 3));

export const HELLO = "hello world";

export function expectedUser(id, page) {
  return {id, page, name: `user-${id}`};
}
