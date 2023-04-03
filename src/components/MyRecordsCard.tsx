import {
  CalenderIcon,
  EditIcon,
  DeleteIcon,
  TimeIcon,
  FileIcon,
  BlackShareIcon,
  DownloadIcon,
  MoreIcon,
} from "../images/index";
import styles from "../styles/MyRecordsCard.module.css";
import DownloadData from "./DownloadData";
import { mobileWidth } from "../components/Constants";
import MoreSelectionModal from "./Modal/MoreSelectionModal";
import { useState } from "react";
import ShareModal from "./Modal/ShareModal";

type Props = {
  data: any;
  setModal: (value: string) => void;
  setSelectedData: (item: any) => void;
  selectedData: any;
  selectedButton: string;
  handleActionItem: (item: any, action: any) => void;
  handleDeleteMobile: (item: any) => void;
  handleShare: (item: any, title: string) => void;
};
type OneCardProps = {
  data: any;
  setModal: (value: string) => void;
  setSelectedData: (item: any) => void;
  selectedData: any;
  selectedButton: string;
  handleActionItem: (item: any, action: any) => void;
  handleDeleteMobile: (item: any) => void;
  handleShare: (item: any, title: string) => void;
};

type TabCardProps = {
  data: any;
  setModal: (value: string) => void;
  setSelectedData: (item: any) => void;
  selectedData: any;
  selectedButton: string;
  handleActionItem: (item: any, action: any) => void;
  handleDownload: (item: any) => void;
  handleDeleteMobile?: (item: any) => void;
  handleShare: (item: any, title: string) => void;
};

const MyRecordsCard = ({
  data,
  setModal,
  setSelectedData,
  selectedData,
  selectedButton,
  handleActionItem,
  handleDeleteMobile,
  handleShare,
}: Props) => {
  const isMobile = window.innerWidth <= mobileWidth ? true : false;
  return (
    <div key={data?.date} style={{ marginBottom: 10 }}>
      <div className={styles.HeaderWrapper}>
        <img src={CalenderIcon} style={{ marginRight: 5 }} alt="date" />
        <div>{data?.date}</div>
      </div>
      <div className={isMobile ? styles.CadMobileWrapper : styles.CadWrapper}>
        {data?.data?.map((el: any) => (
          <OneCard
            key={el?.name}
            data={el}
            selectedData={selectedData}
            setModal={setModal}
            setSelectedData={setSelectedData}
            selectedButton={selectedButton}
            handleActionItem={handleActionItem}
            handleDeleteMobile={handleDeleteMobile}
            handleShare={handleShare}
          />
        ))}
      </div>
    </div>
  );
};

const OneCard = ({
  data,
  setModal,
  setSelectedData,
  selectedData,
  selectedButton,
  handleActionItem,
  handleDeleteMobile,
  handleShare,
}: OneCardProps) => {
  const isMobile = window.innerWidth <= mobileWidth ? true : false;
  const handleDownload = (item: any) => {
    let header = ["Time ( Sec )", "Temperature ( C )"];
    if (selectedButton === "voltage") header = ["Time ( Sec )", "Voltage (V)"];
    else if (selectedButton === "rgb")
      header = ["Measurement No.", "RED", "GREEN", "BLUE"];
    DownloadData({ data: item, header });
  };
  return isMobile ? (
    <MobileCard
      data={data}
      selectedData={selectedData}
      setModal={setModal}
      setSelectedData={setSelectedData}
      selectedButton={selectedButton}
      handleActionItem={handleActionItem}
      handleDownload={handleDownload}
      handleDeleteMobile={handleDeleteMobile}
      handleShare={handleShare}
    />
  ) : (
    <TabCard
      data={data}
      selectedData={selectedData}
      setModal={setModal}
      setSelectedData={setSelectedData}
      selectedButton={selectedButton}
      handleActionItem={handleActionItem}
      handleDownload={handleDownload}
      handleShare={handleShare}
    />
  );
};

const TabCard = ({
  data,
  setModal,
  setSelectedData,
  selectedData,
  selectedButton,
  handleActionItem,
  handleDownload,
  handleShare,
}: TabCardProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleSubmit = (title: string) => {
    if (title) {
      handleShare(data, title);
      setIsOpen(!isOpen);
    }
  };
  return (
    <>
      <div
        onClick={() => setSelectedData(data)}
        key={data?.name}
        className={styles.oneCardWrapper}
        style={
          selectedData?.name === data?.name
            ? { backgroundColor: "#9CD5CD" }
            : {}
        }
      >
        <div className={styles.CardTitleWrapper}>
          <div className={styles.CardTitleWrapperLeft}>
            <img
              src={FileIcon}
              style={{ marginRight: 12, width: 20 }}
              alt="file"
            />
            <div>{data?.name}</div>
          </div>
          <img
            src={EditIcon}
            onClick={() => handleActionItem(data, "edit")}
            style={{ cursor: "pointer", width: 20 }}
            alt="edit"
          />
        </div>
        <div className={styles.CardTitleWrapperLeft}>
          <img
            src={TimeIcon}
            style={{ marginRight: 15, width: 20 }}
            alt="time"
          />
          <div>{data && data["time"]}</div>
        </div>
        <div className={styles.FooterWrapper}>
          <img
            src={BlackShareIcon}
            onClick={() => setIsOpen(!isOpen)}
            className={styles.FooterIcons}
            alt="share"
          />
          <img
            src={DownloadIcon}
            onClick={() => handleDownload(data)}
            className={styles.FooterIcons}
            alt="download"
          />
          <img
            src={DeleteIcon}
            onClick={() => handleActionItem(data, "delete")}
            className={styles.FooterIcons}
            alt="delete"
          />
        </div>
      </div>
      {isOpen && (
        <ShareModal
          isOpen={isOpen}
          setModal={(value: boolean) => setIsOpen(value)}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};

const MobileCard = ({
  data,
  setModal,
  setSelectedData,
  selectedData,
  selectedButton,
  handleActionItem,
  handleDownload,
  handleDeleteMobile,
}: TabCardProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  //setModal("edit")
  const handleSubmit = (value: string) => {
    setIsOpen(!isOpen);
    let getFunction: any = {
      "Rename File": () => handleActionItem(data, "edit"),
      Download: () => handleDownload(data),
      Share: {},
      Delete: handleDeleteMobile ? () => handleDeleteMobile(data) : {},
    };
    if (value) {
      getFunction[value]();
    }
  };
  return (
    <>
      <div
        onClick={() => setSelectedData(data)}
        key={data?.name}
        className={styles.oneCardMobileWrapper}
        style={
          selectedData?.name === data?.name
            ? { backgroundColor: "#9CD5CD" }
            : {}
        }
      >
        <div className={styles.CardTitleWrapper}>
          <div className={styles.CardTitleWrapperLeft}>
            <img
              src={FileIcon}
              style={{ marginRight: 12, width: 20 }}
              alt="file"
            />
            <div>{data?.name}</div>
          </div>
          <img
            src={MoreIcon}
            onClick={() => setIsOpen(!isOpen)}
            style={{ cursor: "pointer", width: 40, marginTop: 10 }}
            alt="edit"
          />
        </div>
        <div className={styles.CardTitleWrapperLeft}>
          <img
            src={TimeIcon}
            style={{ marginRight: 15, width: 20 }}
            alt="time"
          />
          <div>{data && data["time"]}</div>
        </div>
        {/* <div className={styles.FooterWrapper}>
        <img src={BlackShareIcon} className={styles.FooterIcons} alt="share"/>
        <img src={DownloadIcon} onClick = {() => handleDownload(data)} className={styles.FooterIcons} alt="download"/>
        <img src={DeleteIcon} onClick={() => handleActionItem(data,"delete")} className={styles.FooterIcons} alt="delete"/>
        
    </div> */}
      </div>
      {isOpen && (
        <MoreSelectionModal
          isOpen={isOpen}
          setModal={(value: boolean) => setIsOpen(value)}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default MyRecordsCard;
