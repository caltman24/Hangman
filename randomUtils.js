export function number(min = 0, max = 10) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function fromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function hexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}
