import { useState } from 'react';
import { ActionsMenu } from './components/actionsMenu/index.js';
import * as SC from './index.styles.js';
import {
    Parts,
    powerManagementRequestAction,
    abilityTriggerRequestAction,
    ventHeatRequestAction,
} from 'pium-pium-engine';
import { useDispatch } from 'react-redux';

export function ShipMap({ ship }) {
    const [toggledMenus, setToggledMenus] = useState(0);
    const dispatch = useDispatch();

    const countToggledMenus = (menuState) => {
        const valueToAdd = menuState ? +1 : -1;
        const result =
            toggledMenus + valueToAdd > 0 ? toggledMenus + valueToAdd : 0;
        setToggledMenus(result);
    };

    const onPowerRequest = function (subsystem, value) {
        dispatch(
            powerManagementRequestAction({ subsystem, shipId: ship.id, value })
        );
    };

    const onVentHeatRequest = function (subsystem, value) {
        dispatch(
            ventHeatRequestAction({
                subsystem,
                shipId: ship.id,
                value,
            })
        );
    };

    const onAbilityTriggered = function (subsystem, abilityIndex, effectIndex) {
        dispatch(
            abilityTriggerRequestAction({
                subsystem,
                shipId: ship.id,
                abilityIndex,
                effectIndex,
            })
        );
    };

    return (
        <SC.Container>
            <SC.ShipImage src="assets/ship.png"></SC.ShipImage>
            <SC.AftTrapezoid></SC.AftTrapezoid>
            <SC.PortTrapezoid></SC.PortTrapezoid>
            <SC.ForwardTrapezoid></SC.ForwardTrapezoid>
            <SC.StarboardTrapezoid></SC.StarboardTrapezoid>
            {toggledMenus > 0 && <SC.Overlay></SC.Overlay>}
            <SC.Aft>
                {ship?.aft.map((subsystem, index) => (
                    <ActionsMenu
                        key={subsystem.name}
                        onMenuToggled={countToggledMenus}
                        component={Parts[subsystem.type]}
                        reactor={ship.reactor}
                        status={ship.aft[index].status}
                        disabled={toggledMenus > 0}
                        onPowerRequest={(value) =>
                            onPowerRequest(`aft[${index}]`, value)
                        }
                        onVentHeatRequest={(value) =>
                            onVentHeatRequest(`aft[${index}]`, value)
                        }
                        onAbilityTriggered={(abilityIndex, effectIndex) =>
                            onAbilityTriggered(
                                `aft[${index}]`,
                                abilityIndex,
                                effectIndex
                            )
                        }
                    ></ActionsMenu>
                ))}
            </SC.Aft>
            <SC.Port>
                {ship?.port.map((subsystem, index) => (
                    <ActionsMenu
                        key={subsystem.name}
                        onMenuToggled={countToggledMenus}
                        component={Parts[subsystem.type]}
                        reactor={ship.reactor}
                        status={ship.port[index].status}
                        disabled={toggledMenus > 0}
                        onPowerRequest={(value) =>
                            onPowerRequest(`port[${index}]`, value)
                        }
                        onVentHeatRequest={(value) =>
                            onVentHeatRequest(`port[${index}]`, value)
                        }
                        onAbilityTriggered={(abilityIndex, effectIndex) =>
                            onAbilityTriggered(
                                `port[${index}]`,
                                abilityIndex,
                                effectIndex
                            )
                        }
                        horizontal
                    ></ActionsMenu>
                ))}
            </SC.Port>
            <SC.Forward>
                {ship?.forward.map((subsystem, index) => (
                    <ActionsMenu
                        key={subsystem.name}
                        onMenuToggled={countToggledMenus}
                        component={Parts[subsystem.type]}
                        reactor={ship.reactor}
                        status={ship.forward[index].status}
                        disabled={toggledMenus > 0}
                        onPowerRequest={(value) =>
                            onPowerRequest(`forward[${index}]`, value)
                        }
                        onVentHeatRequest={(value) =>
                            onVentHeatRequest(`forward[${index}]`, value)
                        }
                        onAbilityTriggered={(abilityIndex, effectIndex) =>
                            onAbilityTriggered(
                                `forward[${index}]`,
                                abilityIndex,
                                effectIndex
                            )
                        }
                    ></ActionsMenu>
                ))}
            </SC.Forward>
            <SC.Starboard>
                {ship?.starboard.map((subsystem, index) => (
                    <ActionsMenu
                        key={subsystem.name}
                        onMenuToggled={countToggledMenus}
                        component={Parts[subsystem.type]}
                        reactor={ship.reactor}
                        status={ship.starboard[index].status}
                        disabled={toggledMenus > 0}
                        onPowerRequest={(value) =>
                            onPowerRequest(`starboard[${index}]`, value)
                        }
                        onVentHeatRequest={(value) =>
                            onVentHeatRequest(`starboard[${index}]`, value)
                        }
                        onAbilityTriggered={(abilityIndex, effectIndex) =>
                            onAbilityTriggered(
                                `starboard[${index}]`,
                                abilityIndex,
                                effectIndex
                            )
                        }
                        horizontal
                    ></ActionsMenu>
                ))}
            </SC.Starboard>
        </SC.Container>
    );
}
