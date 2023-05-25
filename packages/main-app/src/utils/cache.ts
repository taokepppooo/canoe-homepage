import { isObject } from './index'

let sessionCache: Cache
let localCache: Cache

export const createSessionStorage = () => {
  if (!sessionCache) {
    sessionCache = new Cache(sessionStorage)
  }

  return sessionCache
}

export const createLocalStorage = () => {
  if (!localCache) {
    localCache = new Cache(localStorage)
  }

  return localCache
}

export class Cache {
  storage = sessionStorage

  constructor(storage: Storage) {
    this.storage = storage
  }

  setItem(key: string, value: object | string) {
    if (!key || !value) {
      return
    }

    if (isObject(value)) {
      const valueStringify = JSON.stringify(value)
      this.storage.setItem(key, valueStringify)
    }
  }
  /**
   * 对于深层次结构 property可以使用.指向子对象的属性
   * @param key
   * @param property
   * @param value
   */
  updateItem(key: string, property: string, value: object | string) {
    const storageValue = this.getItem(key) || {}
    if (property.includes('.')) {
      const arr = property.split('.')
      setDeepProperty(storageValue, value, arr)
    } else {
      if (storageValue[property]) {
        storageValue[property] = value as { [key: string]: object | string }
      }
    }

    this.removeItem(key)
    this.setItem(key, storageValue)
  }
  getItem(key: string): { [key: string]: object | string } {
    if (!key) {
      return {}
    }

    const value = this.storage.getItem(key) || ''

    return JSON.parse(value)
  }
  removeItem(key: string) {
    this.storage.removeItem(key)
  }
  clear() {
    this.storage.clear()
  }
}

const setDeepProperty = (
  obj: { [key: string]: object | string },
  value: object | string,
  arr: string[]
) => {
  for (let i = 0; i < arr.length; i++) {
    const _property: string = arr[i]

    if (obj[_property]) {
      const sliceArr = arr.slice(1)
      if (sliceArr.length) {
        setDeepProperty(obj[_property] as { [key: string]: object | string }, value, sliceArr)
      } else {
        obj[_property] = value
      }
    }
  }
}
