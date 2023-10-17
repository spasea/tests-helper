class Time {
  static async sleep(seconds) {
    return new Promise((r) => setTimeout(r, seconds * 1000));
  }

  static async sleep_ms(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
}

export default Time;
