import {Video} from 'remotion';

import video from '../../resources/videos/bg.mp4';
export const YouTubeVideo: React.FC = () => {
	return (
		<Video
			style={{zIndex: -1, transform: `translateX(-32%)`}}
			src={video}
			volume={0}
		/>
	);
};
