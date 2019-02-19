import * as React from 'react';
import WAVEInterface from './waveInterface';
import downloadBlob from './downloadBlob';
import Countdown from 'react-countdown-now';
import 'webrtc-adapter/out/adapter.js';

interface AudioRecorderChangeEvent {
  duration: number,
  audioData?: Blob,
}
interface AudioRecorderProps {
  initialAudio?: Blob,
  downloadable?: boolean,
  loop?: boolean,
  filename?: string,
  className?: string,
  style?: Object,

  onAbort?: () => void,
  onChange?: (AudioRecorderChangeEvent) => void,
  onEnded?: () => void,
  onPause?: () => void,
  onPlay?: () => void,
  onRecordStart?: () => void,

  playLabel?: string,
  playingLabel?: string,
  recordLabel?: string,
  recordingLabel?: string,
  removeLabel?: string,
  downloadLabel?: string,
  disableButton?: boolean
};

interface AudioRecorderState {
  isRecording: boolean,
  isPlaying: boolean,
  audioData?: Blob,
  showCountdown: boolean
};

export default class AudioRecorder extends React.Component<AudioRecorderProps, AudioRecorderState> {
  waveInterface = new WAVEInterface();

  state: AudioRecorderState = {
    isRecording: false,
    isPlaying: false,
    audioData: this.props.initialAudio,
    showCountdown: false
  };

  static defaultProps = {
    loop: false,
    downloadable: true,
    className: '',
    style: {},
    filename: 'output.wav',
    playLabel: '🔊 Play',
    playingLabel: '❚❚ Playing',
    recordLabel: '● Record',
    recordingLabel: '● Recording',
    removeLabel: '✖ Remove',
    downloadLabel: '\ud83d\udcbe Save', // unicode floppy disk,
    disableButton: false
  };

  componentWillReceiveProps(nextProps) {
    // handle new initialAudio being passed in
    if (
      nextProps.initialAudio &&
      nextProps.initialAudio !== this.props.initialAudio &&
      this.state.audioData &&
      nextProps.initialAudio !== this.state.audioData
    ) {
      this.waveInterface.reset();
      this.setState({
        audioData: nextProps.initialAudio,
        isPlaying: false,
        isRecording: false,
      });
    }
  }

  componentWillMount() { this.waveInterface.reset(); }
  componentWillUnmount() { this.waveInterface.reset(); }

  /**
   * Handle the browser's stricter policy for preventing auto play
   * by attempting to un-suspend AudioContext.state if it is 'suspended'.
   * 
   * Reference: https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio 
   * 
   * @param context AudioContext
   */
  async resume(context) {
    const result = await context.resume();

    if (context.state === 'suspended') {
      console.error(`Your browser has suspended the AudioContext. Unable to resume() it. 
      For more details, see:  https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio`);
    }

    return result;
  }

  startRecording() {
    const context = WAVEInterface.audioContext;
    console.log(context.state);
    if (context.state === 'suspended') {
      this.resume(context);
    }

    if (!this.state.isRecording) {
      this.waveInterface.startRecording()
        .then(() => {
          this.setState({ isRecording: true, showCountdown: false });
          if (this.props.onRecordStart) this.props.onRecordStart();
        })
        .catch((err) => { throw err; });
    }
  }

  stopRecording() {
    this.waveInterface.stopRecording();

    this.setState({
      isRecording: false,
      audioData: this.waveInterface.audioData
    });

    if (this.props.onChange) {
      this.props.onChange({
        duration: this.waveInterface.audioDuration,
        audioData: this.waveInterface.audioData
      });
      this.waveInterface.reset();
    }
  }

  startPlayback() {
    const context = WAVEInterface.audioContext;
    if (context.state === 'suspended') {
      this.resume(context);
    }

    if (!this.state.isPlaying) {
      this.waveInterface.startPlayback(this.props.loop, this.onAudioEnded).then(() => {
        this.setState({ isPlaying: true });
        if (this.props.onPlay) this.props.onPlay();
      });
    }
  }

  stopPlayback() {
    this.waveInterface.stopPlayback();
    this.setState({ isPlaying: false });
    if (this.props.onAbort) this.props.onAbort();
  }

  onAudioEnded = () => {
    this.setState({ isPlaying: false });
    if (this.props.onEnded) this.props.onEnded();
  };

  onRemoveClick = () => {
    this.waveInterface.reset();
    if (this.state.audioData && this.props.onChange) this.props.onChange({ duration: 0, audioData: null });
    this.setState({
      isPlaying: false,
      isRecording: false,
      audioData: null,
    });
  };

  renderer = ({ seconds, completed }) => {
    if (completed) {
      // Render a completed state
      this.startRecording();
      return null;
    } else {
      // Render a countdown and 

      return (
        <div>
          <span>Be ready to speak into the microphone in: </span><br/>
          <span>{seconds}</span>
        </div>
      );
    }
  };

  onDownloadClick = () => downloadBlob(this.state.audioData, this.props.filename);

  onButtonClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    if (this.state.isRecording) {
      this.stopRecording();
    } else {
      this.setState({ showCountdown: true});
    }
  };

  render() {
    return (
      <div className="AudioRecorder">
        {
          this.state.showCountdown ?
          (
            <Countdown
              date={Date.now() + 3000}
              renderer={this.renderer}
            />
          ) : (
            <button
              className={
                [
                  'AudioRecorder-button',
                  this.state.audioData ? 'hasAudio' : '',
                  this.state.isPlaying ? 'isPlaying' : '',
                  this.state.isRecording ? 'isRecording' : '',
                ].join(' ')
              }
              onClick={this.onButtonClick}
              disabled={this.props.disableButton}
            >
              {this.state.audioData && this.state.isRecording && this.props.recordingLabel}
              {this.state.audioData && !this.state.isRecording && this.props.recordLabel}
              {!this.state.audioData && !this.state.isRecording && this.props.recordLabel}
              {!this.state.audioData && this.state.isRecording && this.props.recordingLabel}
            </button>         
          )     
        }
      </div>
    );
  }
}
