
import {RightArrowIcon,RightArrowDisabedIcon} from "../images/index"

type Props ={
    handleSubmit?:() =>void
    isSelected:boolean;
    rightArrowRef?:any;
}

const RightArrow = ({handleSubmit,isSelected=false,rightArrowRef}:Props) => {
    const clickHandler = () => {
        if(handleSubmit){
            handleSubmit()
        }
    }
    return <button ref={rightArrowRef} onClick={() => isSelected ? clickHandler() : {}} style={{position:"fixed",bottom:30,right:20,outline:"none",border:"none",backgroundColor:"initial", cursor:isSelected ? "pointer" : "not-allowed"}}>
    <img src={isSelected ? RightArrowIcon : RightArrowDisabedIcon} style={{width:40}} alt="RightArrowIcon"/>
</button>
}

export default RightArrow