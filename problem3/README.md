# Problem 3

## Changes Made

1. `setPrices` is not passed into `useEffect` as a dependency.
2. Improved `filter` and `sort` logic in `sortedBalances` in `useMemo` to avoid
   unnecessary re-renders.
3. `map` is used to transform the sorted balances, should also be memoized.
4. `Datasource` is implemented.
