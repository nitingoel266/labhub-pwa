import WheelPickers from "react-simple-wheel-picker";
import styles from '../styles/WheelPicker.module.css';

type Props = {
    data:any; //{ id: '1',value: 'test1'}
    selectedId?:string;
    handleData:(value:string) => void;
}

const WheelPicker = ({data,selectedId,handleData}:Props) => {
    return <>
        <div className={styles.PickerBackGroundWrapper}>
            <div></div>
            <div className={styles.PickerBackGroundCenter}></div>
            <div></div>
        </div>
        <div className={styles.PickerWrapper}>
            <WheelPickers
                data={data}
                onChange={(value:any) => handleData(value?.value)}
                height={130}
                width={100}
                titleText="Enter value same as aria-label"
                itemHeight={45}
                selectedID={selectedId ? selectedId : data[0].id}
                color="#ccc"
                activeColor="#333"
                backgroundColor="none"
                shadowColor="#EFEFEF"
                focusColor="none"
                idName={styles.WheelPicker}
            />
        </div>
    </>
}

export default WheelPicker