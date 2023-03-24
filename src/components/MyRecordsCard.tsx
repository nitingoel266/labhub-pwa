import {CalenderIcon,EditIcon,DeleteIcon,TimeIcon,FileIcon,BlackShareIcon,DownloadIcon} from "../images/index"
import styles from '../styles/MyRecordsCard.module.css';
import DownloadData from "./DownloadData";

type Props = {
    data:any;
    setModal:(value:string)=>void;
    setSelectedData:(item:any) => void;
    selectedData:any;
    selectedButton:string;
    handleActionItem:(item:any,action:any) => void;
}

const MyRecordsCard = ({data,setModal,setSelectedData,selectedData,selectedButton,handleActionItem}:Props) => {
    return <div key={data?.date} style={{marginBottom:10}}>
        <div className={styles.HeaderWrapper}>
            <img src={CalenderIcon} style={{marginRight:5}} alt="date"/>
            <div>{data?.date}</div>
        </div>
        <div className={styles.CadWrapper}>
            {data?.data?.map((el:any) => <OneCard key={el?.name} data={el} selectedData={selectedData} setModal={setModal} setSelectedData={setSelectedData} selectedButton={selectedButton} handleActionItem={handleActionItem} />)}
        </div>
    </div>
}

const OneCard = ({data,setModal,setSelectedData,selectedData,selectedButton,handleActionItem}:OneCardProps) => {
    const handleDownload = (item:any)=> {
        let header = ["Time ( Sec )","Temperature ( C )"]
        if(selectedButton === 'voltage') header = ["Time ( Sec )","Voltage (V)"];
        else if(selectedButton === "rgb") header = ["Measurement No.","RED","GREEN","BLUE"];
        DownloadData({data:item,header})
    }
    return <div onClick={() => setSelectedData(data)} key={data?.name} className={styles.oneCardWrapper} style={selectedData?.name === data?.name ? {backgroundColor :"#9CD5CD"} : {}}>
        <div className={styles.CardTitleWrapper}>
            <div className={styles.CardTitleWrapperLeft}>
                <img src={FileIcon} style={{marginRight:12,width:20}} alt="file"/>
                <div>{data?.name}</div>
            </div>
            <img src={EditIcon} onClick={() => setModal("edit")} style={{cursor:"pointer",width:20}} alt="edit"/>
        </div>
        <div className={styles.CardTitleWrapperLeft}>
            <img src={TimeIcon} style={{marginRight:15,width:20}} alt="time"/>
            <div>{data && data["time"]}</div>
        </div>
        <div className={styles.FooterWrapper}>
            <img src={BlackShareIcon} className={styles.FooterIcons} alt="share"/>
            <img src={DownloadIcon} onClick = {() => handleDownload(data)} className={styles.FooterIcons} alt="download"/>
            <img src={DeleteIcon} onClick={() => handleActionItem(data,"delete")} className={styles.FooterIcons} alt="delete"/>

        </div>
    </div>
}

type OneCardProps = {
    data:any;
    setModal:(value:string)=>void;
    setSelectedData:(item:any) =>void;
    selectedData:any;
    selectedButton:string;
    handleActionItem:(item:any,action:any) => void;
}

export default MyRecordsCard