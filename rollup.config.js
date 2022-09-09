import dts from "rollup-plugin-dts"
import esbuild from "rollup-plugin-esbuild"

const name = require("./package.json").main.replace(/\.js$/, "")

const bundle = (config) => ({
  ...config,
  input: "pkg/index.ts",
  external: (id) => !/^[./]/.test(id),
})

export default [
  bundle({
    plugins: [esbuild({ tsconfig: "./tsconfig.lib.json" })],
    output: [
      {
        file: `${name}.js`,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: `${name}.mjs`,
        format: "es",
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts({ tsconfig: "./tsconfig.lib.json" })],
    output: {
      file: `${name}.d.ts`,
      format: "es",
    },
  }),
]
