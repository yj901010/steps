import React, { useState } from 'react';
import YouTube from 'react-youtube';

const PostureCorrectionVideo = () => {
    // 특정 YouTube 동영상 ID를 설정
    const defaultVideoId = 'wFvZ7fW9190';
    const [videoId, setVideoId] = useState(defaultVideoId);

    // 영상 ID를 변경하는 함수
    const handleInputChange = (event) => {
        setVideoId(event.target.value);
    };

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <div>
            {/* YouTube 컴포넌트에 고정된 동영상 ID 전달 */}
            <YouTube videoId={videoId} opts={opts} />
        </div>
    );
};

export default PostureCorrectionVideo;