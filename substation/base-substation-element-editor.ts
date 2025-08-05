import { LitElement, TemplateResult, html } from 'lit';
import { property, query, queryAll } from 'lit/decorators.js';

import '@material/mwc-menu';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-icon-button';
import type { IconButton } from '@material/mwc-icon-button';
import type { ListItem } from '@material/mwc-list/mwc-list-item.js';
import type { Menu } from '@material/mwc-menu';

import { newEditEventV2 } from '@omicronenergy/oscd-api/utils.js';
import { getChildren } from '@openenergytools/scl-lib';

import { newCreateWizardEvent, newEditWizardEvent } from '../foundation.js';

/** base class hosting global properties and the remove method */
export default class BaseSubstationElementEditor extends LitElement {
  /** The edited `Function` element */
  @property({ attribute: false })
  element!: Element;

  /** indicator for changes element */
  @property({ type: Number })
  editCount = -1;

  /** Whether function type element shall be shown */
  @property({ type: Boolean })
  showfunctions = false;

  /** Whether text/private type element shall be shown */
  @property({ type: Boolean })
  showuserdef = false;

  @query('mwc-menu') addMenu?: Menu;

  @query('mwc-icon-button[icon="playlist_add"]') addButton!: IconButton;

  @query('.action.remove') removeActionable?: HTMLElement;

  @query('.action.edit') editActionable?: HTMLElement;

  @query('.action.addmenu') addMenuActionable?: HTMLElement;

  @queryAll('.action.add') addActionable?: ListItem[];

  private openCreateWizard(tagName: string): void {
    this.dispatchEvent(newCreateWizardEvent(this.element, tagName));
  }

  openEditWizard(): void {
    this.dispatchEvent(newEditWizardEvent(this.element));
  }

  removeElement(): void {
    this.dispatchEvent(
      newEditEventV2({
        node: this.element,
      }),
    );
  }

  updated(): void {
    if (this.addMenu) this.addMenu.anchor = <HTMLElement>this.addButton;
  }

  private renderAddButtons(): TemplateResult[] {
    const alreadyHasText = this.element.querySelector(':scope > Text') ?? false;

    return getChildren(this.element)
      .filter(
        child => child !== 'Text' || (child === 'Text' && !alreadyHasText),
      )
      .map(
        child =>
          html`<mwc-list-item class="action add" value="${child}"
            ><span>${child}</span></mwc-list-item
          >`,
      );
  }

  renderAddButton(): TemplateResult {
    return html` <abbr slot="action" style="position:relative;">
      <mwc-icon-button
        class="action addmenu"
        icon="playlist_add"
        @click=${() => {
          if (this.addMenu) this.addMenu.open = true;
        }}
      ></mwc-icon-button
      ><mwc-menu
        corner="BOTTOM_RIGHT"
        menuCorner="END"
        @action=${(e: Event) => {
          const tagName = (<ListItem>(<Menu>e.target).selected).value;
          this.openCreateWizard(tagName);
        }}
        >${this.renderAddButtons()}</mwc-menu
      >
    </abbr>`;
  }
}
