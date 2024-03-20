/**
 * used to wrap root async functions to avoid uncaught promise errors to go silent.
 * catchAsync is intended for use in the root-level of an asynchronous chain of functions,
 * basically avoiding the need of using try/catch and risking to leave silent errors in code.
 * @param fn - call back function
 * @returns {(function(*=, *=, *=): void)|*}
 */
export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};


