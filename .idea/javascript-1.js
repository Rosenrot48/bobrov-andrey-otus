export class Javascript1 {
  total: number = 0;
  sum(x: any){
    if (typeof x === 'number') {
      this.total += x;
    } else {
      return this.total;
    }
  }
}
