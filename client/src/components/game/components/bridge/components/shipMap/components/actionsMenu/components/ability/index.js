import { COSTS } from 'pium-pium-engine';
import { Fragment } from 'react';
import { CustomIcon } from '../../../../../../../../../common/CustomIcon';
import * as SC from './index.styles';

const Ability = function ({ ability, status, overlay, disabled, onClick }) {
    const energyCost =
        parseInt(
            ability.costs?.find((cost) => cost.type === COSTS.ENERGY)?.value,
            10
        ) || 0;
    disabled = disabled || status?.power.current < energyCost;
    const onAbilityTriggered = () => {
        if (!disabled && onClick) {
            onClick();
        }
    };
    return (
        <SC.Ability
            overlay={!!overlay}
            disabled={disabled}
            onClick={onAbilityTriggered}
        >
            <SC.COSTS>
                {ability.costs?.map((cost, index) => (
                    <SC.CostContainer key={`cost-${index}`}>
                        {cost.value}&nbsp;
                        {<CustomIcon icon={cost.type}></CustomIcon>}
                    </SC.CostContainer>
                ))}
            </SC.COSTS>
            <SC.TextContainer>{ability.text}</SC.TextContainer>
            <SC.COSTS>
                {ability.effects?.or
                    ?.filter((or) => !or.onlyInSubmenu)
                    .map((or, index) => (
                        <Fragment key={`effect-${index}`}>
                            <SC.CostContainer>
                                {or.value}&nbsp;
                                {<CustomIcon icon={or.type}></CustomIcon>}
                            </SC.CostContainer>
                            {or.text ? (
                                <SC.DetailTextContainer>
                                    {or.text}
                                </SC.DetailTextContainer>
                            ) : null}
                            {index !==
                                ability.effects.or.filter(
                                    (or) => !or.onlyInSubmenu
                                ).length -
                                    1 && <p>|&nbsp;</p>}
                        </Fragment>
                    ))}
            </SC.COSTS>
        </SC.Ability>
    );
};

export default Ability;
