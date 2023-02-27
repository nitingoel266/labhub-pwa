import { useEffect, useState } from "react"
import {useDeviceStatus} from "../../labhub/status";
import LeadeSelectionModal from "./leaderSelectionModal"

const LeaderDisconnect = () => {
    const [isOpen,setModal] = useState(false)
  const [status] = useDeviceStatus();
    useEffect(() => {
        if(status && !status.leaderSelected){
            setModal(true)
        }
    },[status?.leaderSelected])
    return <>
        {isOpen && <LeadeSelectionModal isOpen={isOpen} setModal={(value) => setModal(value)}/>}
    </>
}

export default LeaderDisconnect