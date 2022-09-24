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
import {YouTubeVideo} from '../BackgroundVideo/YouTubeVideo';
import {RedditContent} from './RedditContent';

export const RedditTitleComp: React.FC<{
	thread: Array<RedditThread>;
	audio: Array<string>;
	clip_durations: Array<number>;
	audio_clip_time: Array<number>;
	video_clip_time: Array<number>;
}> = ({thread, audio,  audio_clip_time, video_clip_time}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const [audioClipTime, setAudioClipTime] = useState(audio_clip_time);
	const [videoClipTime, setVideoClipTime] = useState(video_clip_time);

	useEffect(() => {
		console.log("change", audio_clip_time)
		setAudioClipTime(audio_clip_time)
		setVideoClipTime(video_clip_time)
	}, [audio_clip_time, video_clip_time])

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

			{/* <Sequence from={0} durationInFrames={Infinity} name={'YouTubeBG'}>
				<YouTubeVideo />
			</Sequence> */}
		</>
	);
};
