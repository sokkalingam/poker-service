export class WaitUtils {

  static wait(timeInMs: number) {
    return new Promise(resolve => setTimeout(resolve, timeInMs));
  }

}