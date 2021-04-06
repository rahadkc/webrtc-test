import React, { useContext } from 'react';
import { SocketContext } from '../socketContext';

const Notifications = () => {
 const { answerCall, call, callAccepted } = useContext(SocketContext)

 const handleAnswer = (e) => {
  // e.preventDefault()
  answerCall()
 }

 console.log('call :>> ', call);

  return (
    <>
      {call.isReceivedCall && !callAccepted && (
        <div>
          <h3>{call.name} is calling:  <button onClick={handleAnswer}>Answer</button></h3>
        </div>
      )}
    </>
  );
}

export default Notifications