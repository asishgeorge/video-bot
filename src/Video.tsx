import {useEffect, useCallback, useState} from 'react';
import {continueRender, delayRender, Composition} from 'remotion';
import {RedditTitleComp} from './components/RedditContent/RedditTitleComp';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
let video_data = require('./resources/input.json');


export const RemotionVideo: React.FC = () => {
	const [data, setData] = useState({
		thread: video_data.thread,
		base64_audio: video_data.base64_audio,
	});
	const [audioClipTime, setAudioClipTime] = useState([0]);
	const [videoClipTime, setVideoClipTime] = useState([0]);
	const [duration, setDuration] = useState(1);

	const [handle] = useState(() => delayRender());

	const fetchData = useCallback(async () => {
    let p: Array<Promise<number>> = [];
		data.base64_audio.forEach((a: string) => {
			p.push(getAudioDurationInSeconds(a));
		});
		Promise.all(p).then((time) => {
			setAudioClipTime(time);

			let videoClip: Array<number> = [];
			let counter = 0;
			data.thread.forEach((t: any) => {
				let clip_len = 0;

				for (let i = 0; i < t.audio.length; i++) {
					clip_len = clip_len + time[counter + i];
				}

				counter += t.audio.length;
				console.log('counter', counter);

				videoClip.push(clip_len);
			});
			console.log('videoClip', videoClip);
			console.log('time', time);

			setVideoClipTime(videoClip);
			let a = videoClip.reduce(
				(previousValue, currentValue) => previousValue + currentValue,
				0
			);
			console.log("duration", Math.round(a))
			setDuration(Math.round(a))
			continueRender(handle);
		});
  }, [handle]);

	
	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.tsx <id> out/video.mp4
				id="RedditTitleComp"
				component={RedditTitleComp}
				durationInFrames={!duration || duration > 1800 ? 1800 : duration * 30}
				fps={30}
				width={1080}
				height={1920}
				// You can override these props for each render:
				// https://www.remotion.dev/docs/parametrized-rendering
				defaultProps={{
					thread: data.thread,
					audio: data.base64_audio,
					clip_durations: [],
					audio_clip_time: audioClipTime,
					video_clip_time: videoClipTime,
				}}
			/>
		</>
	);
};
