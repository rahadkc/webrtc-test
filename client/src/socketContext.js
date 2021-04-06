import { createContext, useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { io } from 'socket.io-client';

const SocketContext = createContext()

const socket = io('http://localhost:5000')



const  ContextProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [name, setName] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [currentPeer, setCurrentPeer] = useState(null);
    console.log('me :>> ', me);

    const myVideo = useRef(null)
    const callerVideo = useRef(null)
    const connectionRef = useRef(null)

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: {
            sampleSize: 16,
            channelCount: 2,
            echoCancellation: true,
            noiseSuppression: true
        } })
        .then((currentStream) => {
            setStream(currentStream)
            myVideo.current.srcObject = currentStream
        }) 

        socket.on('me', (id) => setMe(id))

        socket.on('calluser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivedCall: true, from, name: callerName, signal })
        })


    }, []);

    // const handleShare  = (stream) => {
    //     let videoTrack = stream.getVideoTracks()[0]
    //     let sender = currentPeer.getSender().find((s) => {
    //         return s.track.kind = videoTrack.kind
    //     })

    //     videoTrack.onended = () => {
    //         let videoTrack = stream.getVideoTracks()[0]
    //         let sender = currentPeer.getSender().find((s) => {
    //             return s.track.kind = videoTrack.kind
    //         })   
    //         sender.replaceTrack(videoTrack)
    //     }
    //     sender.replaceTrack(videoTrack)
    // }

    const shareScreen = () => {
        navigator.mediaDevices.getDisplayMedia({
            video: {
                cursor: 'always'
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true
            }
        }).then((stream) => {
            let videoTrack = stream.getVideoTracks()[0]
            let sender = currentPeer.getSender().find((s) => {
                return s.track.kind = videoTrack.kind
            })

            videoTrack.onended = () => {
                let videoTrack = stream.getVideoTracks()[0]
                let sender = currentPeer.getSender().find((s) => {
                    return s.track.kind = videoTrack.kind
                })   
                sender.replaceTrack(videoTrack)
            }
            sender.replaceTrack(videoTrack)
        }).catch((err) => {
            console.log('err in Share Screen :>> ', err);
        })
    }


    const answerCall = () => {
        setCallAccepted(true)

        const peer = new Peer({ initiator: false, trickle: false, stream })

        peer.on('signal', (data) => {
            socket.emit('answercall', { signal: data, to: call.from })
        })

        peer.on('stream', (currentStream) => {
            callerVideo.current.srcObject = currentStream
        })

        peer.signal(call.signal)

        setCurrentPeer(peer.peerConnection)
        connectionRef.current = peer
    }

    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream })

        peer.on('signal', (data) => {
            socket.emit('calluser', { userToCall: id, signalData: data, from: me,  name })
        })

        peer.on('stream', (currentStream) => {
            callerVideo.current.srcObject = currentStream
        })

        socket.on('callaccepted', (signal) => {
            setCallAccepted(true)

            peer.signal(signal)
        })

        setCurrentPeer(peer.peerConnection)


        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy()

        window.location.reload()
    }


    return (
        <SocketContext.Provider value={{
            call, callAccepted, callEnded, myVideo, callerVideo, stream, name, setName, me, callUser, leaveCall, answerCall, shareScreen
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext };
