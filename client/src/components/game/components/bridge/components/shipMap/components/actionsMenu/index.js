import { useState } from 'react';
import * as SC from './index.styles.js';
import { CustomIcon } from '../../../../../../../common/CustomIcon';
import { RadialMenu } from '../../../../../../../common/RadialMenu';
import Ability from './components/ability';
import { Costs } from 'pium-pium-engine/lib/data/parts.js';

const hiearchicalMenuGenerator = (
    ability,
    abilityIndex,
    status,
    submenuRadius,
    submenuStartAngle,
    onSubmenuOpen,
    onAbilityTriggered
) => {
    const energyCost =
        parseInt(
            ability.costs?.find((cost) => cost.type === Costs.ENERGY)?.value,
            10
        ) || 0;
    const disabled = status?.power.current < energyCost;
    return (
        <RadialMenu
            key={`ability-${abilityIndex}`}
            onMenuToggled={onSubmenuOpen}
            disabled={disabled}
            customToggle={
                <Ability
                    ability={ability}
                    status={status}
                    overlay={false}
                ></Ability>
            }
            radius={submenuRadius}
            startAngle={submenuStartAngle}
        >
            {ability.effects.or.map((or, effectIndex) => (
                <Ability
                    ability={{
                        effects: { or: [{ ...or, onlyInSubmenu: false }] },
                    }}
                    key={`ability-${abilityIndex}-effect-or-${effectIndex}`}
                    onClick={() =>
                        onAbilityTriggered(abilityIndex, effectIndex)
                    }
                />
            ))}
        </RadialMenu>
    );
};

export const ActionsMenu = ({
    component: { type, abilities },
    reactor,
    status,
    onMenuToggled,
    radius = 6,
    startAngle = Math.round(-360 / (abilities.length + 2)),
    submenuRadius = 6,
    submenuStartAngle = 0,
    horizontal,
    disabled,
    onPowerRequest,
    onAbilityTriggered,
    onVentHeatRequest,
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
            disabled={disabled}
            customToggle={
                <SC.ActionToggleContainer>
                    <SC.PowerIndicator
                        horizontal={horizontal}
                        disabled={disabled}
                    >
                        {status?.power.current}
                    </SC.PowerIndicator>
                    <SC.UsedPowerIndicator
                        horizontal={horizontal}
                        disabled={disabled}
                    >
                        {status?.power.used}
                    </SC.UsedPowerIndicator>
                    <SC.HeatIndicator
                        horizontal={horizontal}
                        disabled={disabled}
                    >
                        {status?.heat}
                    </SC.HeatIndicator>
                    <SC.IconButton disabled={disabled}>
                        <CustomIcon
                            icon={isMenuOpen ? 'clear' : type}
                        ></CustomIcon>
                    </SC.IconButton>
                </SC.ActionToggleContainer>
            }
        >
            {[
                <Ability
                    key={'powerUp'}
                    overlay={submenuOpen}
                    disabled={reactor.current <= 0}
                    onClick={() => onPowerRequest(1)}
                    ability={{
                        effects: { or: [{ type: Costs.ENERGY, value: '+1' }] },
                    }}
                />,
                <Ability
                    key={'powerDown'}
                    overlay={submenuOpen}
                    disabled={
                        reactor.current >= reactor.total ||
                        reactor.vented >= reactor.maxVent
                    }
                    onClick={() => onPowerRequest(-1)}
                    ability={{
                        effects: { or: [{ type: Costs.ENERGY, value: '-1' }] },
                    }}
                />,
                <Ability
                    key={'ventHeat'}
                    overlay={submenuOpen}
                    disabled={status.heat === 0}
                    onClick={() => onVentHeatRequest(-1)}
                    ability={{
                        effects: {
                            or: [{ type: Costs.HEAT, value: '-1' }],
                        },
                    }}
                />,
                ...abilities?.map((ability, abilityIndex) =>
                    ability.effects?.or?.length === 1 ? (
                        <Ability
                            key={`ability-${abilityIndex}`}
                            ability={ability}
                            status={status}
                            overlay={submenuOpen}
                            onClick={() => onAbilityTriggered(abilityIndex)}
                        ></Ability>
                    ) : (
                        hiearchicalMenuGenerator(
                            ability,
                            abilityIndex,
                            status,
                            submenuRadius,
                            submenuStartAngle,
                            setSubmenuOpen,
                            onAbilityTriggered
                        )
                    )
                ),
            ]}
        </RadialMenu>
    );
};
