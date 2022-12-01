import * as SC from './index.styles';
import { useState, Children, useEffect, Fragment } from 'react';
import { CustomIcon } from '../CustomIcon';

export const RadialMenu = function ({
    className,
    openIcon,
    closedIcon,
    children,
    customToggle,
    startAngle = Math.round(-360 / children.length),
    rotationAngle = 360,
    radius = 5,
    onMenuToggled,
    disabled,
}) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => onMenuToggled(isOpen), [isOpen]);
    const angleCalculator = function (index) {
        let angle = startAngle;
        let increment = 0;
        if (children.length > 1) {
            increment = Math.round(rotationAngle / children.length);
        }
        angle += index * increment;
        return angle;
    };
    const childrenArray = Children.toArray(children);
    return (
        <SC.Wrapper className={className}>
            <SC.ChildrenContainer>
                {childrenArray.map((child, index) => {
                    return (
                        <SC.Line
                            key={`radial-line-${index}`}
                            angle={(angleCalculator(index) * Math.PI) / 180}
                            radius={radius}
                            isOpen={isOpen}
                        ></SC.Line>
                    );
                })}
            </SC.ChildrenContainer>
            <SC.Toggle onClick={() => !disabled && setIsOpen(!isOpen)}>
                {!customToggle ? (
                    <SC.IconButton>
                        <CustomIcon
                            icon={isOpen ? openIcon : closedIcon}
                        ></CustomIcon>
                    </SC.IconButton>
                ) : (
                    customToggle
                )}
            </SC.Toggle>
            <SC.ChildrenContainer>
                {childrenArray.map((child, index) => {
                    return (
                        <SC.RadialChild
                            key={`radial-child-${index}`}
                            angle={(angleCalculator(index) * Math.PI) / 180}
                            radius={radius}
                            isOpen={isOpen}
                        >
                            {child}
                        </SC.RadialChild>
                    );
                })}
            </SC.ChildrenContainer>
        </SC.Wrapper>
    );
};
