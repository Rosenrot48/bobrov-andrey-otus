function sum(firstArgument) {
  var total = firstArgument;
  return function by(secondArgument) {
    if (secondArgument === undefined) {
      return total;
    } else {
      total += secondArgument;
      return by;
    }
  }
}
sum(1)(2)(3)(4)()
