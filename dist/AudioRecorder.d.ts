import * as React from 'react';
import WAVEInterface from './waveInterface';
import 'webrtc-adapter/out/adapter.js';
interface AudioRecorderProps {
    initialAudio?: Blob;
    downloadable?: boolean;
    loop?: boolean;
    filename?: string;
    className?: string;
    style?: Object;
    onAbort?: () => void;
    onChange?: (AudioRecorderChangeEvent: any) => void;
    onEnded?: () => void;
    onPause?: () => void;
    onPlay?: () => void;
    onRecordStart?: () => void;
    playLabel?: string;
    playingLabel?: string;
    recordLabel?: string;
    recordingLabel?: string;
    removeLabel?: string;
    downloadLabel?: string;
    disableButton?: boolean;
}
interface AudioRecorderState {
    isRecording: boolean;
    isPlaying: boolean;
    audioData?: Blob;
    showCountdown: boolean;
}
export default class AudioRecorder extends React.Component<AudioRecorderProps, AudioRecorderState> {
    waveInterface: WAVEInterface;
    state: AudioRecorderState;
    static defaultProps: {
        loop: boolean;
        downloadable: boolean;
        className: string;
        style: {};
        filename: string;
        playLabel: string;
        playingLabel: string;
        recordLabel: string;
        recordingLabel: string;
        removeLabel: string;
        downloadLabel: string;
        disableButton: boolean;
    };
    componentWillReceiveProps(nextProps: any): void;
    componentWillMount(): void;
    componentWillUnmount(): void;
    /**
     * Handle the browser's stricter policy for preventing auto play
     * by attempting to un-suspend AudioContext.state if it is 'suspended'.
     *
     * Reference: https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
     *
     * @param context AudioContext
     */
    resume(context: any): Promise<any>;
    startRecording(): void;
    stopRecording(): void;
    startPlayback(): void;
    stopPlayback(): void;
    onAudioEnded: () => void;
    onRemoveClick: () => void;
    renderer: ({ seconds, completed }: {
        seconds: any;
        completed: any;
    }) => JSX.Element;
    onDownloadClick: () => HTMLAnchorElement;
    onButtonClick: (event: React.SyntheticEvent<HTMLButtonElement, Event>) => void;
    render(): JSX.Element;
}
export {};
