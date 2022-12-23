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
            <SC.Costs>
                {ability.costs?.map((cost, index) => (
                    <SC.CostContainer key={`cost-${index}`}>
                        {cost.value}&nbsp;
                        {<CustomIcon icon={cost.type}></CustomIcon>}
                    </SC.CostContainer>
                ))}
            </SC.Costs>
            <SC.TextContainer>{ability.text}</SC.TextContainer>
            <SC.Costs>
                {ability.effects?.or
                    ?.filter((or) => !or.onlyInSubmenu)
                    .map((or, index) => (
                        <Fragment key={`effect-${index}`}>
                            <SC.CostContainer>
                                {Array.isArray(or.value)
                                    ? or.value.join('x')
                                    : or.value}
                                &nbsp;
                                <CustomIcon icon={or.type}></CustomIcon>
                            </SC.CostContainer>
                            {or.difficulty && (
                                <SC.CostContainer>
                                    {or.difficulty}
                                    &nbsp;
                                    <CustomIcon icon="dice"></CustomIcon>
                                </SC.CostContainer>
                            )}
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
            </SC.Costs>
        </SC.Ability>
    );
};

export default Ability;
