export default function defaultLockedUntil() {
  var now = new Date();
  now.setDate(now.getDate() + 1); // Add 1 day to current date
  return now
}