import { useEffect, useState } from "react";
import {WarningIcon} from "../../images/index";

type Props ={
    text:string;
    time?:number;
}
const Toast = ({text,time=3000}:Props) => {
    const [isOpen,setModal] = useState(false)
    console.log("??>>")
    useEffect(() => {
        setModal(true)
        const timer = setTimeout(() => {setModal(false)},time);
        return() => {
            clearTimeout(timer)
        }
    },[])
    return (<div style={{position:"fixed"}}>
        {isOpen &&
        <div
        style={{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            position: "fixed",
            backgroundColor: "black",
            opacity:.5
            }}
        // onClick={hideModal}
        />}
        <div
        style={{
            top: 200,
            right: 50,
            height: 200,
            width: 250,
            backgroundColor: "#D9D9D9",
            borderRadius: 5,
            position: "fixed",
            opacity: isOpen ? 1 : 0,
            transition: "all 0.3s ease-out",
            transform: isOpen ? "translateY(0)" : "translateY(-100vh)"
            }}
        >
            <div>dee</div>
        </div>
        </div>)
}
export default Toast