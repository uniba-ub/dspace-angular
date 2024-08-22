import { Component, EventEmitter, Input, Output } from '@angular/core';

export enum SwitchColor {
  Primary = 'primary',
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
}

export interface SwitchOption {
  value: any;
  icon?: string;
  iconColor?: SwitchColor;
  label?: string;
  labelColor?: SwitchColor;
  backgroundColor?: SwitchColor;
}

@Component({
  selector: 'ds-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent {
  /**
   * The options available for the switch
   */
  @Input() options: SwitchOption[] = [];

  /**
   * The currently selected value
   */
  @Input() selectedValue: any;

  /**
   * Event emitted when the selected value changes
   */
  @Output() selectedValueChange = new EventEmitter<any>();

  /**
   * Update the selected value and emit the change event
   * @param value The new value to select
   */
  onOptionClick(value: any) {

    this.selectedValue = value;
    this.selectedValueChange.emit(this.selectedValue);

  }

  /**
   * Returns the background color class based on the selected value.
   * Defaults to 'bg-default' if no specific color is set.
   */
  getBackgroundColorClass(): string {
    const selectedOption = this.options.find(option => option.value === this.selectedValue);
    if (selectedOption && selectedOption.backgroundColor) {
      return `bg-${selectedOption.backgroundColor}`;
    }
    return 'bg-default';
  }

}
