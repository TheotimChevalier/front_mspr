export default {
    transform: {
      "^.+\\.[jt]sx?$": "babel-jest",
    },
    transformIgnorePatterns: [
      "/node_modules/(?!(axios)/)", // 👈 permet de transpiler axios
    ],
    testEnvironment: "jsdom",
  };
  