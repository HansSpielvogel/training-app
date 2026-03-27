import Dexie from 'dexie'

class TrainingDatabase extends Dexie {
  constructor() {
    super('TrainingApp')
    this.version(1).stores({})
  }
}

export const db = new TrainingDatabase()
