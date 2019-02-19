var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as React from 'react';
import WAVEInterface from './waveInterface';
import downloadBlob from './downloadBlob';
import Countdown from 'react-countdown-now';
import 'webrtc-adapter/out/adapter.js';
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
                // Render a countdown and 
                return (React.createElement("div", null,
                    React.createElement("span", null, "Be ready to speak into the microphone in: "),
                    React.createElement("br", null),
                    React.createElement("span", null, seconds)));
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
    /**
     * Handle the browser's stricter policy for preventing auto play
     * by attempting to un-suspend AudioContext.state if it is 'suspended'.
     *
     * Reference: https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
     *
     * @param context AudioContext
     */
    AudioRecorder.prototype.resume = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.resume()];
                    case 1:
                        result = _a.sent();
                        if (context.state === 'suspended') {
                            console.error("Your browser has suspended the AudioContext. Unable to resume() it. \n      For more details, see:  https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio");
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    AudioRecorder.prototype.startRecording = function () {
        var _this = this;
        var context = WAVEInterface.audioContext;
        console.log(context.state);
        if (context.state === 'suspended') {
            this.resume(context);
        }
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
        var context = WAVEInterface.audioContext;
        if (context.state === 'suspended') {
            this.resume(context);
        }
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
            ].join(' '), onClick: this.onButtonClick, disabled: this.props.disableButton },
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
        downloadLabel: '\ud83d\udcbe Save',
        disableButton: false
    };
    return AudioRecorder;
}(React.Component));
export default AudioRecorder;
