import React, { useContext, useState } from 'react';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { SocketContext } from '../socketContext';


const Options = ({ children }) => {
  const {me, callAccepted, name, setName, callEnded, leaveCall, callUser, shareScreen} = useContext(SocketContext)
  const [idToCall, setIdCall] = useState('')

  const handleChange = (e) =>  {
    e.preventDefault()
    setName(e.target.value)
    // setIdCall(e.target.value)
  }


  return (
    <div className="callInfoWrapper">
        <form noValidate autoComplete="off" className="callForm">
          <div>
            <p>Account Info</p>
            <input placeholder="name" value={name} onChange={handleChange}/>
            <CopyToClipboard text={me} onCopy={() => console.log('cpoied')}>
              <span>Copy your ID</span>
            </CopyToClipboard>
            </div>
          <div>
            <p>Make a call</p>
            <input placeholder="ID to Call" value={idToCall} onChange={(e) => setIdCall(e.target.value)}/>
            {callAccepted && !callEnded ? (
              <button onClick={leaveCall}>Hang Up</button>
            ) : (
              <button onClick={(e) => {
                e.preventDefault()
                callUser(idToCall)
              }}>Call</button>
            )}
          </div>
        </form>
      {children}

      <div>
        <button onClick={(e) => {
          e.preventDefault()
          shareScreen()
        }}>Share screen</button>
      </div>
    </div>
  );
}

export default Options