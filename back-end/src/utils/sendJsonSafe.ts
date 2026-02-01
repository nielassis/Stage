export function jsonSafe<T>(data: T): any {
  return JSON.parse(
    JSON.stringify(data, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value,
    ),
  );
}

export function sendJsonSafe(reply: any, payload: any, statusCode?: number) {
  if (statusCode) reply.status(statusCode);
  return reply.send(jsonSafe(payload));
}
