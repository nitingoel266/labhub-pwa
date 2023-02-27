import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberDisconnect from '../../components/Modal/MemberDisconnectModal';
import MyRecordsCard from '../../components/MyRecordsCard';
import RightArrow from '../../components/RightArrow';
import styles from '../../styles/myRecordList.module.css';

const MyRecordList = () => {
    const navigate = useNavigate();
    const [isOpen,setModal] = useState("")
    const [selectedData,setSelectedData] = useState<any>()
    const [selectedButton,setSelectedButton] = useState<string>("temperature")
    const handleSubmit = () => {
        navigate(`/${selectedButton}-records`)
    }
    const handleDelete = () => {

    }
    const handleEdit = () => {

    }
    const data:any = {
        temperature:[{date:"03/02/2023",data:[{name:"T0918564122-1123-771","last edited":"10.23PM"},{name:"T0918564122-1123-772","last edited":"10.23PM"},{name:"T0918564122-1123-773","last edited":"10.23PM"}]},{date:"01/02/2023",data:[{name:"T0918564122-1123-774","last edited":"10.23PM"},{name:"T0918564122-1123-775","last edited":"10.23PM"}]},{date:"21/01/2023",data:[{name:"T0918564122-1123-776","last edited":"10.23PM"},{name:"T0918564122-1123-777","last edited":"10.23PM"}]}],
        voltage:[{date:"01/02/2023",data:[{name:"T0918564122-1123-774","last edited":"10.23PM"},{name:"T0918564122-1123-775","last edited":"10.23PM"}]},{date:"21/01/2023",data:[{name:"T0918564122-1123-776","last edited":"10.23PM"},{name:"T0918564122-1123-777","last edited":"10.23PM"}]}],
        rgb:[{date:"03/02/2023",data:[{name:"T0918564122-1123-771","last edited":"10.23PM"},{name:"T0918564122-1123-772","last edited":"10.23PM"}]}]
        }
    return <div className={styles.myRecordWrapper}>
        <div className={styles.myRecordButtonWrapper}>
            <div onClick={() => setSelectedButton('temperature')} className={styles.myRecordButton} style={selectedButton === 'temperature' ? {color:"#FFFFFF",backgroundColor:"#424C58"} : {}}>Temperature</div>
            <div onClick={() => setSelectedButton('voltage')} className={styles.myRecordButton} style={selectedButton === 'voltage' ? {color:"#FFFFFF",backgroundColor:"#424C58"} : {}}>Voltage</div>
            <div onClick={() => setSelectedButton('rgb')} className={styles.myRecordButton} style={selectedButton === 'rgb' ? {color:"#FFFFFF",backgroundColor:"#424C58"} : {}}>RGB</div>
        </div>
        <div style={{overflowY:"auto",height:window.innerHeight-171}}>
            {data && data[selectedButton].map((el:any) => <MyRecordsCard key={el?.date} data={el} setModal ={(value) => setModal(value)} setSelectedData={(value) => setSelectedData(value)} selectedData={selectedData}/>)}
        </div>
        <MemberDisconnect isOpen={isOpen ? true : false} setModal = {(value) =>setModal(value)} handleDisconnect={isOpen === 'delete' ? handleDelete : handleEdit} message={`Do you want to ${isOpen}.`}/>
        <RightArrow isSelected={selectedData ? true : false} handleSubmit={handleSubmit}/>
    </div>
}

export default MyRecordList;