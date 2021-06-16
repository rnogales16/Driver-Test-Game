class Chronometer {
  constructor() {
    this.currentTime = 0;
    this.intervalId = null;
  }

  start() {
    if (this.intervalId % 17 === 0) this.currentTime += 1;
  }

  getMinutes() {
    return Math.floor(this.currentTime/60);
  }

  getSeconds() {
    return this.currentTime % 60;
  }

  computeTwoDigitNumber(value) {
    if(value.toString().length == 1){
      value = "0" + value.toString();
    }else if(value.toString().length == 2) {
      value = value.toString();
    }
    return value;
  }
}