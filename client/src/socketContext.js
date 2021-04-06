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
    console.log('me :>> ', me);

    const myVideo = useRef(null)
    const callerVideo = useRef(null)
    const connectionRef = useRef(null)

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((currentStreamer) => {
            setStream(currentStreamer)
            myVideo.current.srcObject = currentStreamer
        }) 

        socket.on('me', (id) => setMe(id))

        socket.on('calluser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivedCall: true, from, name: callerName, signal })
        })

    }, []);


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

        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy()

        window.location.reload()
    }


    return (
        <SocketContext.Provider value={{
            call, callAccepted, callEnded, myVideo, callerVideo, stream, name, setName, me, callUser, leaveCall, answerCall
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext };
