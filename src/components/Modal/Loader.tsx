// import {useConnectionStablished} from "../../labhub/status";
import { useEffect } from "react";
import {LoaderImage} from "../../images/index";
import styles from '../../styles/Loader.module.css';
import {showLoader, useShowLoader} from "../Constants";
import { useLocation } from "react-router-dom";

const Loader = () => {
    const [loader] = useShowLoader();
    const location = useLocation();
    useEffect(() => {
        if(loader) showLoader.next(false)
    },[location?.pathname])
    return loader ? <div style={{position:"absolute",zIndex:1}}>
        {loader &&
        <div
        className={styles.TopWrapper}
        />}
        <div
        className={styles.loaderWrapper}
        >
            <img src={LoaderImage} style={{width:60}} alt="loader gif"/>
        </div>
        </div> : null
}

export default Loader;