import { useState, Fragment } from 'react';
import * as SC from './index.styles.js';
import { CustomIcon } from '../../../../../../../common/CustomIcon';
import { RadialMenu } from '../../../../../../../common/RadialMenu';

const abilityGenerator = (ability, overlay, key) => (
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
                            ability.effects.or.filter((or) => !or.onlyInSubmenu)
                                .length -
                                1 && <p>|&nbsp;</p>}
                    </Fragment>
                ))}
        </SC.Costs>
    </SC.Ability>
);

export const ActionsMenu = ({ name, abilities, onMenuToggled, overlay }) => {
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);
    return (
        <RadialMenu
            onMenuToggled={(isOpen) => {
                setMenuOpen(isOpen);
                onMenuToggled(isOpen);
            }}
            customToggle={
                <SC.ActionToggleContainer>
                    <SC.IconButton>
                        <CustomIcon
                            icon={isMenuOpen ? 'clear' : name}
                        ></CustomIcon>
                    </SC.IconButton>
                </SC.ActionToggleContainer>
            }
        >
            {abilities?.map((ability, abilityIndex) =>
                ability.effects?.or?.length === 1 ? (
                    abilityGenerator(
                        ability,
                        submenuOpen || overlay,
                        `ability-${abilityIndex}`
                    )
                ) : (
                    <RadialMenu
                        key={`ability-${abilityIndex}`}
                        onMenuToggled={setSubmenuOpen}
                        customToggle={abilityGenerator(
                            ability,
                            submenuOpen || overlay,
                            `ability-toggle-${abilityIndex}`
                        )}
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
            )}
        </RadialMenu>
    );
};
