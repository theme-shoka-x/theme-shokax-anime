import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: './src/index.ts',
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        entryFileNames: '[name].cjs.js',
        sourcemap: false,
      },
      {
        dir: 'dist',
        format: 'esm',
        entryFileNames: '[name].esm.js',
        sourcemap: false,
      },
      {
        dir: 'dist',
        format: 'umd',
        entryFileNames: '[name].umd.js',
        name: 'anime',
        sourcemap: false,
        plugins: [terser()],
      },
    ],
    plugins: [typescript({ module: "ESNext" })],
  }
]

