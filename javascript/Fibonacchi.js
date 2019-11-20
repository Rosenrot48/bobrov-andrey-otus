var FibonacciMap = new Map();
function Fibonacci(blocker) {
  FibonacciMap.set(0,0);
  FibonacciMap.set(1,1);
  const FibonacciKey = FibonacciMap.size;
  while (FibonacciKey !== blocker) {
    const FibonacciValue = FibonacciMap.get(FibonacciKey - 2) + FibonacciMap.get(FibonacciKey - 1);
    FibonacciMap.set(FibonacciKey, FibonacciValue);
    return Fibonacci(blocker);
  }
  console.log(FibonacciMap);
}

Fibonacci(50);

