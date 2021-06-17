class Chronometer {
  constructor() {
    this.currentTime = 0;
    this.intervalId = null;
  }

  start(callback) {
    this.intervalId = setInterval(() => {
      this.currentTime += 1;
    }, 1000)
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