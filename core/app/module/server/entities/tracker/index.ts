export abstract class Tracker {
  public benchmark = (name: string) => {
    // check metrics
    return {
      start: () => {},
      end: () => {}
    }
  }
}
