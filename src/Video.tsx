import {useEffect, useCallback, useState} from 'react';
import {continueRender, delayRender, Composition} from 'remotion';
import {RedditTitleComp} from './components/RedditContent/RedditTitleComp';
import {getRedditData} from './services/api';
import {RedditThread} from './types/reddit_types';

export const RemotionVideo: React.FC = () => {
	const [data, setData] = useState({
		thread: [],
		base64_audio: [],
	});
	const [handle] = useState(() => delayRender());

	const fetchData = useCallback(async () => {
		let d = new Date().getTime();
		let thread = localStorage.getItem('thread');
		if (!thread) {
			try {
				const response  = await getRedditData();
				// you can find the sample response to the api in the sample_response.json file
				
				setData(response);
				localStorage.setItem('thread', JSON.stringify(response));
				console.log((new Date().getTime() - d) / 100);
				continueRender(handle);
			} catch (error) {
				console.error(error);
				continueRender(handle);
			}
		} else {
			setData(JSON.parse(thread));
			console.log((new Date().getTime() - d) / 100);
			continueRender(handle);
		}
	}, [handle]);

	useEffect(() => {
		fetchData();
		console.log('sdfsd');
	}, [fetchData]);

	return (
		<>
			<Composition
				// You can take the "id" to render a video:
				// npx remotion render src/index.tsx <id> out/video.mp4
				id="RedditTitleComp"
				component={RedditTitleComp}
				durationInFrames={1800}
				fps={30}
				width={1080}
				height={1920}
				// You can override these props for each render:
				// https://www.remotion.dev/docs/parametrized-rendering
				defaultProps={{
					thread: data.thread,
					audio: data.base64_audio,
					clip_durations: [],
				}}
			/>
		</>
	);
};
