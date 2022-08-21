/**
  * A valid metadata value.
  */
export type Value =
  | LeafValue
  | SetValue
  | ListValue

export type MaybeValue = Value | undefined


export type LeafValue = string | number | boolean | null

export function isLeaf(value: Value): boolean {
  return value === null || ["string", "number", "boolean"].some(kind => typeof value == kind)
}


export type SetValue = { [x: string]: Value }

export function isSet(value: Value): boolean {
  return value !== null && typeof value == "object" && !Array.isArray(value)
}


export type ListValue = Array<Value>


export type ValueError = Error
export type MaybeValueError = ValueError | undefined



export function isEmptyValue(value: Value): boolean {
  if (typeof value == "string" || Array.isArray(value)) {
    return value.length == 0
  }

  if (typeof value == "object" && value != null) {
    return Object.keys(value).length == 0
  }

  return value == null
}
