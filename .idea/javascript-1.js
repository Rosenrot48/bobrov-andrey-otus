class Javascript1 {
  total = 0;
  sum(x){
    if (typeof x === 'number') {
      this.total += x;
    } else {
      return this.total;
    }
  }
}

var summary = new Javascript1();
summary.sum(1);
