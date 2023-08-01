import localForage from 'localforage'

type SetType = object | string

export class Cache {
  private storage: typeof localForage

  constructor(driver?: string) {
    this.storage = localForage
    this.storage.setDriver(driver || localForage.INDEXEDDB)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setItem(key: string, value: SetType): Promise<number | any> {
    if (typeof value === 'object' || typeof value === 'string') {
      value = JSON.stringify(value)
    }

    return new Promise((resolve, reject) => {
      this.storage
        .setItem(key, value)
        .then(() => {
          resolve(1)
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((error: any) => {
          reject(error)
        })
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeItem(key: string): Promise<number | any> {
    return new Promise((resolve, reject) => {
      this.storage
        .removeItem(key)
        .then(() => {
          resolve(1)
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((error: any) => {
          reject(error)
        })
    })
  }
}
