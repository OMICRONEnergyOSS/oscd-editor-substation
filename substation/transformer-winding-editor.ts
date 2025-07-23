import { TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@openscd/oscd-action-icon';
import '@openscd/oscd-action-pane';

import './tap-changer-editor.js';
import { renderLNodes } from './l-node-editor.js';
import { renderEqFunctions } from './eq-function-editor.js';
import { renderSubEquipments } from './sub-equipment-editor.js';
import { renderText } from './text-editor.js';
import { renderPrivate } from './private-editor.js';

import { getChildElementsByTagName, styles } from '../foundation.js';
import BaseSubstationElementEditor from './base-substation-element-editor.js';

@customElement('transformer-winding-editor')
export class TransformerWindingEditor extends BaseSubstationElementEditor {
  /** TransformerWinding name attribute */
  @property({ type: String })
  get label(): string {
    const name = this.element.getAttribute('name');
    const desc = this.element.getAttribute('desc');

    return `${name}${desc ? `—  ${desc}` : ''}`;
  }

  private renderTapChanger(): TemplateResult {
    const tapChangers = getChildElementsByTagName(this.element, 'TapChanger');

    return html` ${tapChangers.map(
      tapChanger =>
        html`<tap-changer-editor
          .element=${tapChanger}
          .editCount=${this.editCount}
          ?showfunctions=${this.showfunctions}
          ?showuserdef=${this.showuserdef}
        ></tap-changer-editor>`,
    )}`;
  }

  render(): TemplateResult {
    return html`<oscd-action-pane label="${this.label}">
      <abbr slot="action" title="Edit">
        <mwc-icon-button
          class="action edit"
          icon="edit"
          @click=${() => this.openEditWizard()}
        ></mwc-icon-button>
      </abbr>
      <abbr slot="action" title="Remove">
        <mwc-icon-button
          class="action remove"
          icon="delete"
          @click=${() => this.removeElement()}
        ></mwc-icon-button>
      </abbr>
      ${this.renderAddButton()}
      ${renderText(
        this.element,
        this.editCount,
        this.showfunctions,
        this.showuserdef,
      )}
      ${renderPrivate(
        this.element,
        this.editCount,
        this.showfunctions,
        this.showuserdef,
      )}
      ${renderLNodes(this.element, this.editCount, this.showfunctions)}
      ${this.renderTapChanger()}
      ${renderEqFunctions(this.element, this.editCount, this.showuserdef)}
      ${renderSubEquipments(
        this.element,
        this.editCount,
        this.showfunctions,
        this.showuserdef,
      )}
    </oscd-action-pane> `;
  }

  static styles = css`
    ${styles}
  `;
}
