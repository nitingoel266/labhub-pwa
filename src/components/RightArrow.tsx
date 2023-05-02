
import {RightArrowIcon,RightArrowDisabedIcon} from "../images/index"

type Props ={
    handleSubmit?:() =>void
    isSelected:boolean;
}

const RightArrow = ({handleSubmit,isSelected=false}:Props) => {
    const clickHandler = () => {
        if(handleSubmit){
            handleSubmit()
        }
    }
    return <div onClick={() => isSelected ? clickHandler() : {}} style={{position:"fixed",bottom:30,right:20,cursor:isSelected ? "pointer" : "not-allowed"}}>
    <img src={isSelected ? RightArrowIcon : RightArrowDisabedIcon} style={{width:40}} alt="RightArrowIcon"/>
</div>
}

export default RightArrow