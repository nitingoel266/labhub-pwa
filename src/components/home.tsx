import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {LabIcon,LabHubText} from "../images/index";
import styles from '../styles/home.module.css';

function Home(props: HomeProps) {
  const navigate  = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {navigate('/scan-devices')},3000)
    return () => {
      clearTimeout(timer)
    }
  },[navigate])

  return (
    <div className={styles.bodyWrapper} style={{height:window.innerHeight-40}}>
      <img src={LabHubText} className={styles.LabHubText} alt="lab hub text"/>
      <img src={LabIcon} className={styles.LabHubImage} alt="labIcon"/>
    </div>
  );
}

export default Home;

export interface HomeProps {}
