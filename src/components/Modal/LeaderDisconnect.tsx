import { useEffect, useState } from "react"
import {useDeviceStatus,useDeviceConnected} from "../../labhub/status";
// import {joinAsMember} from "../../labhub/actions";
import LeadeSelectionModal from "./leaderSelectionModal";
import {LEADER_SELECTIONMODAL_INITIATE} from "../../components/Constants";

const LeaderDisconnect = () => {
    // const navigate = useNavigate();
    const [isOpen,setModal] = useState(false)
    const [status] = useDeviceStatus();
    const [connected] = useDeviceConnected();

    useEffect(() => { //if device is connected and leader is not there so leader selection modal
        if(connected && status && !status.leaderSelected){
            setModal(true)
        }
    },[connected,status, status?.leaderSelected])

    useEffect(() => { //if leader selection modal is canceled so after 30sec it will re-initiate
        const timer = setTimeout(()=>{
            if(connected && status && !status.leaderSelected){
                setModal(true)
            }
        },LEADER_SELECTIONMODAL_INITIATE)
        return () => {
            clearTimeout(timer)
        }
    },[isOpen,connected,status])

    // useEffect(() => { // if leader selected and connection established the all members should be on mode selection screen
    //         if(connected && status && status?.leaderSelected /* && joinedAsLeader */){
    //             // joinAsMember()
    //             // setModal(false)
    //             if(location.pathname === '/scan-devices')
    //             navigate("/mode-selection")
    //         }
    // },[status?.leaderSelected,connected,navigate,status,location?.pathname,joinedAsLeader])
    // console.log("??>> joinedAsLeader ",joinedAsLeader)
    // console.log("in the leader selection :- connected",connected,"status :- ",status)
    return <>
        {connected && !status?.leaderSelected && isOpen && <LeadeSelectionModal isOpen={isOpen} setModal={(value) => setModal(value)} />}
    </>
}

export default LeaderDisconnect