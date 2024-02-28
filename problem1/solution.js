var sum_to_n_a = function(n) {
  return (n + 1) / 2 * n;
};

var sum_to_n_b = function(n) {
  return Array.from({length: n}, (v, i) => i + 1).reduce((a, b) => a + b, 0);
};

var sum_to_n_c = function(n) {
  let total = 0;
    for(let i = 0; i <= n; i++) {
        total += i;
    }
    return total;
};

console.log(sum_to_n_a(10));
console.log(sum_to_n_b(10));
console.log(sum_to_n_c(10));
