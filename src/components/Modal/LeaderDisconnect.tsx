import { useEffect, useState } from "react"
import {useDeviceStatus,useSocketConnected} from "../../labhub/status";
import LeadeSelectionModal from "./leaderSelectionModal"

const LeaderDisconnect = () => {
    const [isOpen,setModal] = useState(false)
  const [status] = useDeviceStatus();
  const [connected] = useSocketConnected();

    useEffect(() => {
        if(connected && status && !status.leaderSelected){
            setModal(true)
        }
    },[connected,status, status?.leaderSelected])

    useEffect(() => {
        const timer = setTimeout(()=>{
            if(connected && status && !status.leaderSelected){
                setModal(true)
            }
        },3000)
        return () => {
            clearTimeout(timer)
        }
    },[isOpen])
    return <>
        {connected && !status?.leaderSelected && isOpen && <LeadeSelectionModal isOpen={isOpen} setModal={(value) => setModal(value)}/>}
    </>
}

export default LeaderDisconnect