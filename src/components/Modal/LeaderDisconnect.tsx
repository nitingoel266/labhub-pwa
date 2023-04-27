import { useEffect, useState } from "react";
import { useDeviceStatus, useDeviceConnected } from "../../labhub/status";
import LeadeSelectionModal from "./leaderSelectionModal";
import { LEADER_SELECTIONMODAL_INITIATE } from "../../components/Constants";

const LeaderDisconnect = () => {
  const [isOpen, setModal] = useState(false);
  const [status] = useDeviceStatus();
  const [connected] = useDeviceConnected();

  useEffect(() => {
    //if device is connected and leader is not there so leader selection modal
    if (connected && !status?.leaderSelected) {
      setModal(true);
    }
  }, [connected, status?.leaderSelected]);

  useEffect(() => {
    //if leader selection modal is canceled so after 30sec it will re-initiate
    const timer = setInterval(() => {
      if (connected && !status?.leaderSelected) {
        setModal(true);
      }
    }, LEADER_SELECTIONMODAL_INITIATE);
    return () => {
      clearInterval(timer);
    };
  }, [isOpen, connected, status?.leaderSelected]);

  // useEffect(() => { // if leader selected and connection established the all members should be on mode selection screen
  //         if(connected && status && status?.leaderSelected /* && joinedAsLeader */){
  //             // joinAsMember()
  //             // setModal(false)
  //             if(location.pathname === '/scan-devices')
  //             navigate("/mode-selection")
  //         }
  // },[status?.leaderSelected,connected,navigate,status,location?.pathname,joinedAsLeader])
  return (
    <>
      {connected && !status?.leaderSelected && isOpen && (
        <LeadeSelectionModal
          isOpen={isOpen}
          setModal={(value) => setModal(value)}
        />
      )}
    </>
  );
};

export default LeaderDisconnect;
