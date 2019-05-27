module.exports = {
  entry: './dist/AudioRecorder.js',
  output: {
    filename: './AudioRecorder.min.js',
    library: 'AudioRecorder',
    libraryTarget: 'var'
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
};
