import React from 'react';
import PropTypes from "prop-types";
import classNames from "classnames";

import './Button.scss'

const Button = ({children, onClick, className, disable, active, ...attrs}) => {
    const onClickAction = e => {
        if (disable) {
            e.preventDefault();
        } else {
            return onClick(e);
        }
    }

    const classes = classNames(
        'btn',
        className,
        active
    )

    const Tag = attrs.href ? 'a' : 'button'


    return (
        <Tag
            className={classes}
            disabled={disable}
            onClick={onClickAction}
            {...attrs}
        >
            {children}
        </Tag>
    );
};

Button.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    className: PropTypes.string,
    disable: PropTypes.bool,
    active: PropTypes.bool
}

Button.defaultProps = {
    children: 'Button name',
    onClick: () => {},
    className: '',
    disable: false,
    active: false,
}


export default Button;
