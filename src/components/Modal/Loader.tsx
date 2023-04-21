import {useConnectionStablished} from "../../labhub/status";
import {LoaderImage} from "../../images/index";
import styles from '../../styles/Loader.module.css';

const Loader = () => {
    const [isConnected] = useConnectionStablished();

    return isConnected ? <div style={{position:"absolute",zIndex:1}}>
        {isConnected &&
        <div
        className={styles.TopWrapper}
        />}
        <div
        className={styles.SecondWrapper}
        >
            <img src={LoaderImage} style={{width:100}} alt="loader gif"/>
        </div>
        </div> : null
}

export default Loader;