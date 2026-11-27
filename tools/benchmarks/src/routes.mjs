import {isDeepStrictEqual} from "node:util";

import {expectedUser, HELLO, ORDER_BODY, ORDERS, ORDERS_SIZE, totalOf} from "../app/fixtures.js";

const ORDER_JSON = JSON.stringify(ORDER_BODY);

/**
 * Routes measured on every target. `raw` marks the routes the raw apps implement.
 */
export const ROUTES = [
  {
    id: "hello",
    method: "GET",
    path: "/hello",
    raw: true,
    expected: {status: 200, text: HELLO}
  },
  {
    id: "users",
    method: "GET",
    path: "/users/42?page=3",
    expected: {status: 200, json: expectedUser(42, 3)}
  },
  {
    id: "orders-create",
    method: "POST",
    path: "/orders",
    headers: {"content-type": "application/json"},
    body: ORDER_JSON,
    expected: {status: 200, json: {...ORDER_BODY, total: totalOf(ORDER_BODY)}}
  },
  {
    id: "orders-list",
    method: "GET",
    path: `/orders?size=${ORDERS_SIZE}`,
    expected: {status: 200, json: ORDERS}
  }
];

export function selectRoutes(ids) {
  if (!ids?.length) {
    return ROUTES;
  }

  const unknown = ids.filter((id) => !ROUTES.some((route) => route.id === id));

  if (unknown.length) {
    throw new Error(`Unknown routes: ${unknown.join(", ")} (known: ${ROUTES.map((route) => route.id).join(", ")})`);
  }

  return ROUTES.filter((route) => ids.includes(route.id));
}

/**
 * Compares a response with the expected status and body. Returns the reason of a mismatch, or null.
 */
export function checkResponse(route, {status, text}) {
  const {expected} = route;

  if (status !== expected.status) {
    return `expected status ${expected.status}, got ${status}: ${text.slice(0, 300)}`;
  }

  if (expected.text !== undefined && text !== expected.text) {
    return `expected body ${JSON.stringify(expected.text)}, got ${JSON.stringify(text.slice(0, 300))}`;
  }

  if (expected.json !== undefined) {
    let json;

    try {
      json = JSON.parse(text);
    } catch {
      return `expected a JSON body, got ${JSON.stringify(text.slice(0, 300))}`;
    }

    if (!isDeepStrictEqual(json, expected.json)) {
      return `unexpected JSON body: ${text.slice(0, 300)}`;
    }
  }

  return null;
}

export async function request(baseUrl, route) {
  const response = await fetch(baseUrl + route.path, {method: route.method, headers: route.headers, body: route.body});

  return {status: response.status, text: await response.text()};
}

/**
 * Checks every route of a server before it is measured.
 */
export async function verifyRoutes(baseUrl, routes) {
  const errors = [];

  for (const route of routes) {
    const reason = checkResponse(route, await request(baseUrl, route));

    if (reason) {
      errors.push(`${route.method} ${route.path}: ${reason}`);
    }
  }

  return errors;
}
