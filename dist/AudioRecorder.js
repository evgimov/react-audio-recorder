var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import WAVEInterface from './waveInterface';
import downloadBlob from './downloadBlob';
import Countdown from 'react-countdown-now';
;
;
var AudioRecorder = /** @class */ (function (_super) {
    __extends(AudioRecorder, _super);
    function AudioRecorder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.waveInterface = new WAVEInterface();
        _this.state = {
            isRecording: false,
            isPlaying: false,
            audioData: _this.props.initialAudio,
            showCountdown: false
        };
        _this.onAudioEnded = function () {
            _this.setState({ isPlaying: false });
            if (_this.props.onEnded)
                _this.props.onEnded();
        };
        _this.onRemoveClick = function () {
            _this.waveInterface.reset();
            if (_this.state.audioData && _this.props.onChange)
                _this.props.onChange({ duration: 0, audioData: null });
            _this.setState({
                isPlaying: false,
                isRecording: false,
                audioData: null,
            });
        };
        _this.renderer = function (_a) {
            var seconds = _a.seconds, completed = _a.completed;
            if (completed) {
                // Render a completed state
                _this.startRecording();
                return null;
            }
            else {
                // Render a countdown
                return React.createElement("span", null, seconds);
            }
        };
        _this.onDownloadClick = function () { return downloadBlob(_this.state.audioData, _this.props.filename); };
        _this.onButtonClick = function (event) {
            if (_this.state.isRecording) {
                _this.stopRecording();
            }
            else {
                _this.setState({ showCountdown: true });
            }
        };
        return _this;
    }
    AudioRecorder.prototype.componentWillReceiveProps = function (nextProps) {
        // handle new initialAudio being passed in
        if (nextProps.initialAudio &&
            nextProps.initialAudio !== this.props.initialAudio &&
            this.state.audioData &&
            nextProps.initialAudio !== this.state.audioData) {
            this.waveInterface.reset();
            this.setState({
                audioData: nextProps.initialAudio,
                isPlaying: false,
                isRecording: false,
            });
        }
    };
    AudioRecorder.prototype.componentWillMount = function () { this.waveInterface.reset(); };
    AudioRecorder.prototype.componentWillUnmount = function () { this.waveInterface.reset(); };
    AudioRecorder.prototype.startRecording = function () {
        var _this = this;
        if (!this.state.isRecording) {
            this.waveInterface.startRecording()
                .then(function () {
                _this.setState({ isRecording: true, showCountdown: false });
                if (_this.props.onRecordStart)
                    _this.props.onRecordStart();
            })
                .catch(function (err) { throw err; });
        }
    };
    AudioRecorder.prototype.stopRecording = function () {
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
    };
    AudioRecorder.prototype.startPlayback = function () {
        var _this = this;
        if (!this.state.isPlaying) {
            this.waveInterface.startPlayback(this.props.loop, this.onAudioEnded).then(function () {
                _this.setState({ isPlaying: true });
                if (_this.props.onPlay)
                    _this.props.onPlay();
            });
        }
    };
    AudioRecorder.prototype.stopPlayback = function () {
        this.waveInterface.stopPlayback();
        this.setState({ isPlaying: false });
        if (this.props.onAbort)
            this.props.onAbort();
    };
    AudioRecorder.prototype.render = function () {
        return (React.createElement("div", { className: "AudioRecorder" }, this.state.showCountdown ?
            (React.createElement(Countdown, { date: Date.now() + 3000, renderer: this.renderer })) : (React.createElement("button", { className: [
                'AudioRecorder-button',
                this.state.audioData ? 'hasAudio' : '',
                this.state.isPlaying ? 'isPlaying' : '',
                this.state.isRecording ? 'isRecording' : '',
            ].join(' '), onClick: this.onButtonClick },
            this.state.audioData && this.state.isRecording && this.props.recordingLabel,
            this.state.audioData && !this.state.isRecording && this.props.recordLabel,
            !this.state.audioData && !this.state.isRecording && this.props.recordLabel,
            !this.state.audioData && this.state.isRecording && this.props.recordingLabel))));
    };
    AudioRecorder.defaultProps = {
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
        downloadLabel: '\ud83d\udcbe Save' // unicode floppy disk
    };
    return AudioRecorder;
}(React.Component));
export default AudioRecorder;
