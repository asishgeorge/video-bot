import {useEffect, useState} from 'react';
import {
	continueRender,
	delayRender,
	Sequence,
	Series,
	Audio,
	useVideoConfig,
} from 'remotion';
import {RedditThread} from '../../types/reddit_types';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {YouTubeVideo} from '../BackgroundVideo/YouTubeVideo';
import {RedditContent} from './RedditContent';

export const RedditTitleComp: React.FC<{
	thread: Array<RedditThread>;
	audio: Array<string>;
	clip_durations: Array<number>;
}> = ({thread, audio, clip_durations}) => {
	const [handle1] = useState(() => delayRender());
	const {fps, durationInFrames} = useVideoConfig();
	const [audioClipTime, setAudioClipTime] = useState([0]);
	const [videoClipTime, setVideoClipTime] = useState([0]);

	useEffect(() => {
		let p: Array<Promise<number>> = [];
		audio.forEach((a) => {
			p.push(getAudioDurationInSeconds(a));
		});
		Promise.all(p).then((time) => {
			setAudioClipTime(time);

			let videoClip: Array<number> = [];
			let counter = 0;
			thread.forEach((t) => {
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
			continueRender(handle1);
		});
	}, [thread]);

	return (
		<>
			<Sequence from={0}>
				{thread.length && videoClipTime.length > 2 && (
					<Series>
						{thread.map((t, idx) => (
							<Series.Sequence
								key={idx}
								layout="none"
								durationInFrames={Math.round(videoClipTime[idx] * fps)}
							>
								<RedditContent title={t.body} />
							</Series.Sequence>
						))}
					</Series>
				)}
				{audio.length && audioClipTime.length > 2 && (
					<Series>
						{audio.map(
							(a, idx) =>
								a && (
									<Series.Sequence
										key={idx}
										layout="none"
										durationInFrames={Math.round(audioClipTime[idx] * fps)}
									>
										<Audio src={a} />
									</Series.Sequence>
								)
						)}
					</Series>
				)}
			</Sequence>

			<Sequence from={0} durationInFrames={Infinity} name={'YouTubeBG'}>
				<YouTubeVideo />
			</Sequence>
		</>
	);
};
