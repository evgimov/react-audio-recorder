module.exports = {
  entry: './dist/AudioRecorder.js',
  output: {
    filename: './AudioRecorder.min.js',
    library: 'AudioRecorder',
    libraryTarget: 'var'
  },
  externals: [
    {
      'react': {
        amd: 'react',
        commonjs: 'react',
        commonjs2: 'react',
        root: 'React'
      }
    },
    {
      'react-dom': {
        amd: 'react-dom',
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        root: 'ReactDOM'
      }
    }
  ]
};
