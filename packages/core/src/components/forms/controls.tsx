/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as classNames from "classnames";
import * as React from "react";

import { IProps, removeNonHTMLProps } from "../../common/props";
import { safeInvoke } from "../../common/utils";

export interface IControlProps extends IProps {
    /** Whether the control is checked. */
    checked?: boolean;

    /** Whether the control is initially checked (uncontrolled) */
    defaultChecked?: boolean;

    /** Ref handler that receives HTML `<input>` element backing this component. */
    inputRef?: (ref: HTMLInputElement) => any;

    /** Text label for control. */
    label?: string;

    /** Event handler invoked when input value is changed */
    onChange?: React.FormEventHandler<HTMLInputElement>;
}

/** Base Component class for all Controls */
export class Control<P extends IControlProps> extends React.Component<React.HTMLProps<HTMLInputElement> & P, {}> {
    // generates control markup for given input type.
    // optional inputRef in case the component needs reference for itself (don't forget to invoke the prop!).
    protected renderControl(type: "checkbox" | "radio", typeClassName: string, inputRef = this.props.inputRef) {
        return (
            <label className={classNames("pt-control", typeClassName, this.props.className)} style={this.props.style}>
                <input {...removeNonHTMLProps(this.props, ["children"], true)} ref={inputRef} type={type} />
                <span className="pt-control-indicator" />
                {this.props.label}
                {this.props.children}
            </label>
        );
    }
}

export interface ICheckboxProps extends IControlProps {
    /** Whether this checkbox is initially indeterminate (uncontrolled) */
    defaultIndeterminate?: boolean;

    /** Whether this checkbox is indeterminate */
    indeterminate?: boolean;
}

export class Checkbox extends Control<ICheckboxProps> {
    public static displayName = "Blueprint.Checkbox";

    // must maintain internal reference for `indeterminate` support
    private input: HTMLInputElement;

    public render() {
        return this.renderControl("checkbox", "pt-checkbox", this.handleInputRef);
    }

    public componentDidMount() {
        if (this.props.defaultIndeterminate != null) {
            this.input.indeterminate = this.props.defaultIndeterminate;
        }
        this.updateIndeterminate();
    }

    public componentDidUpdate() {
        this.updateIndeterminate();
    }

    private updateIndeterminate() {
        if (this.props.indeterminate != null) {
            this.input.indeterminate = this.props.indeterminate;
        }
    }

    private handleInputRef = (ref: HTMLInputElement) => {
        this.input = ref;
        safeInvoke(this.props.inputRef, ref);
    }
}

export interface ISwitchProps extends IControlProps {}

export class Switch extends Control<ISwitchProps> {
    public static displayName = "Blueprint.Switch";

    public render() {
        return this.renderControl("checkbox", "pt-switch");
    }
}

export interface IRadioProps extends IControlProps {}

export class Radio extends Control<IRadioProps> {
    public static displayName = "Blueprint.Radio";

    public render() {
        return this.renderControl("radio", "pt-radio");
    }
}

export const CheckboxFactory = React.createFactory(Checkbox);
export const SwitchFactory = React.createFactory(Switch);
export const RadioFactory = React.createFactory(Radio);
