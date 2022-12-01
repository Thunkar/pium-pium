import * as SC from './index.styles';

export function Reactor({ ship }) {
    return (
        <SC.Container>
            {ship && (
                <SC.ReactorCore>
                    <SC.Energy>
                        {ship?.reactor.current}/{ship?.reactor.total}
                        <br></br>
                        {ship?.reactor.vented}/{ship?.reactor.maxVent}
                    </SC.Energy>
                </SC.ReactorCore>
            )}
        </SC.Container>
    );
}
