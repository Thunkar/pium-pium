import { useSelector } from 'react-redux';
import { selectRemainingEnergy, selectTotalEnergy } from '../../../../../../reducers/shipSlice';
import * as SC from './index.styles'

export function Reactor() {

    const remainingEnergy = useSelector(selectRemainingEnergy);
    const totalEnergy = useSelector(selectTotalEnergy);
    
    return (
        <SC.Container>
            <h1>{remainingEnergy}/{totalEnergy}</h1>
        </SC.Container>
    )
}