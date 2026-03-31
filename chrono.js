class Chronometer {
  constructor() {
    this.currentTime = 0;
    this.intervalId = null;
  }

  start() {
    this.intervalId = setInterval(() => {
      this.currentTime += 1;
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  reset() {
    this.stop();
    this.currentTime = 0;
  }

  getMinutes() {
    return Math.floor(this.currentTime / 60);
  }

  getSeconds() {
    return this.currentTime % 60;
  }

  getTimeString() {
    const min = String(this.getMinutes()).padStart(2, "0");
    const sec = String(this.getSeconds()).padStart(2, "0");
    return `${min}:${sec}`;
  }

  computeTwoDigitNumber(value) {
    return String(value).padStart(2, "0");
  }
}
