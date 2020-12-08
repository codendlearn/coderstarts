import React from 'react'
import {useParams} from 'react-router-dom'
import Participants from './Participants'
import VideoCall from './VideoCall'

const VideoConsultation: React.FC = (props) => {
    const {groupId} = useParams<{groupId: string}>()

    return (
        <div>
            <VideoCall groupId={groupId ?? ""} />
            <Participants />
        </div>
    )
}

export default VideoConsultation
