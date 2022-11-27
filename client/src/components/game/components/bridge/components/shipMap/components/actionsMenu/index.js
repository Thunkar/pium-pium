import { useState, Fragment } from 'react';
import * as SC from './index.styles.js';
import { CustomIcon } from '../../../../../../../common/CustomIcon';
import { RadialMenu } from '../../../../../../../common/RadialMenu';

const abilityGenerator = (ability, overlay, key) => {
    return (
        <SC.Ability overlay={!!overlay} key={key} variant="contained">
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
                                {or.value}&nbsp;
                                {<CustomIcon icon={or.name}></CustomIcon>}
                            </SC.CostContainer>
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

const hiearchicalMenuGenerator = (
    abilities,
    overlay,
    submenuRadius,
    submenuStartAngle,
    onSubmenuOpen
) =>
    abilities?.map((ability, abilityIndex) =>
        ability.effects?.or?.length === 1 ? (
            abilityGenerator(ability, overlay, `ability-${abilityIndex}`)
        ) : (
            <RadialMenu
                key={`ability-${abilityIndex}`}
                onMenuToggled={onSubmenuOpen}
                customToggle={abilityGenerator(
                    ability,
                    false,
                    `ability-toggle-${abilityIndex}`
                )}
                radius={submenuRadius}
                startAngle={submenuStartAngle}
            >
                {ability.effects.or.map((or, index) => (
                    <SC.Ability
                        key={`ability-${abilityIndex}-effect-or-${index}`}
                        variant="contained"
                    >
                        <SC.CostContainer>
                            {or.value}&nbsp;
                            {<CustomIcon icon={or.name}></CustomIcon>}
                            {or.text ? (
                                <SC.DetailTextContainer>
                                    {or.text}
                                </SC.DetailTextContainer>
                            ) : null}
                        </SC.CostContainer>
                    </SC.Ability>
                ))}
            </RadialMenu>
        )
    );

export const ActionsMenu = ({
    component: { name, abilities },
    status,
    onMenuToggled,
    radius,
    startAngle = Math.round(-360 / (abilities.length + 2)),
    submenuRadius,
    submenuStartAngle = 0,
    horizontal,
    disabled,
}) => {
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);
    disabled = disabled && !isMenuOpen;
    return (
        <RadialMenu
            radius={submenuOpen ? 0 : radius}
            startAngle={startAngle}
            onMenuToggled={(isOpen) => {
                setMenuOpen(isOpen);
                onMenuToggled(isOpen);
            }}
            customToggle={
                <SC.ActionToggleContainer>
                    <SC.PowerIndicator
                        horizontal={horizontal}
                        disabled={disabled}
                    >
                        {status?.power.inUse}
                    </SC.PowerIndicator>
                    <SC.HeatIndicator
                        horizontal={horizontal}
                        disabled={disabled}
                    >
                        {status?.heat}
                    </SC.HeatIndicator>
                    <SC.IconButton disabled={disabled}>
                        <CustomIcon
                            icon={isMenuOpen ? 'clear' : name}
                        ></CustomIcon>
                    </SC.IconButton>
                </SC.ActionToggleContainer>
            }
        >
            {[
                <SC.Ability key={'powerUp'} overlay={submenuOpen}>
                    <SC.Costs>
                        <SC.CostContainer>
                            +1&nbsp;
                            <CustomIcon icon={'energy'}></CustomIcon>
                        </SC.CostContainer>
                    </SC.Costs>
                </SC.Ability>,
                <SC.Ability key={'powerDown'} overlay={submenuOpen}>
                    <SC.Costs>
                        <SC.CostContainer>
                            -1&nbsp;
                            <CustomIcon icon={'energy'}></CustomIcon>
                        </SC.CostContainer>
                    </SC.Costs>
                </SC.Ability>,
                ...hiearchicalMenuGenerator(
                    abilities,
                    submenuOpen,
                    submenuRadius,
                    submenuStartAngle,
                    setSubmenuOpen
                ),
            ]}
        </RadialMenu>
    );
};
