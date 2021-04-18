export function logger(debugMode: boolean) {
  return debugMode ? log : silent
}

export function silent(_msg: string) {}

export function log(msg: string) {
  console.info(`metatable: ${msg}`)
}
