import "colors";

const LOG_P = "[*]".blue,
  WARN_P = "[!]".yellow,
  ERROR_P = "[!!]".red;

function log(...args) {
  for (let i = 0; i < args.length; i++) {
    console.log(LOG_P, args[i]);
  }
}

const info = log;

function warn(...args) {
  for (let i = 0; i < args.length; i++) {
    console.log(WARN_P, args[i]);
  }
}

function error(...args) {
  for (let i = 0; i < args.length; i++) {
    console.error(ERROR_P, "Error:".red, args[i]);
  }
}

export { log, info, warn, error };

