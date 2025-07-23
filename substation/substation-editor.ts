import { TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@material/mwc-icon-button';
import '@openscd/oscd-action-pane';

import './voltage-level-editor.js';
import { renderFunctions } from './function-editor.js';
import { renderGeneralEquipment } from './general-equipment-editor.js';
import { renderLNodes } from './l-node-editor.js';
import { renderPowerTransformerContainer } from './power-transformer-editor.js';
import { renderText } from './text-editor.js';
import { renderPrivate } from './private-editor.js';

import { getChildElementsByTagName, styles } from '../foundation.js';
import BaseSubstationElementEditor from './base-substation-element-editor.js';

/** [[`Substation`]] plugin subeditor for editing `Substation` sections. */
@customElement('substation-editor')
export class SubstationEditor extends BaseSubstationElementEditor {
  @property({ type: String })
  get header(): string {
    const name = this.element.getAttribute('name');
    const desc = this.element.getAttribute('desc');

    return `${name} ${desc ? `- ${desc}` : ''}`;
  }

  render(): TemplateResult {
    return html`<oscd-action-pane label="${this.header}">
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
      ${renderGeneralEquipment(
        this.element,
        this.editCount,
        this.showfunctions,
        this.showuserdef,
      )}
      ${renderPowerTransformerContainer(
        this.element,
        this.editCount,
        this.showfunctions,
        this.showuserdef,
      )}
      ${getChildElementsByTagName(this.element, 'VoltageLevel').map(
        voltageLevel =>
          html`<voltage-level-editor
            .editCount=${this.editCount}
            .element=${voltageLevel}
            ?showfunctions=${this.showfunctions}
            ?showuserdef=${this.showuserdef}
          ></voltage-level-editor>`,
      )}
      ${renderFunctions(
        this.element,
        this.editCount,
        this.showfunctions,
        this.showuserdef,
      )}
    </oscd-action-pane>`;
  }

  static styles = css`
    ${styles}
  `;
}

export function renderSubstations(
  parent: Element,
  editCount: number,
  showfunctions: boolean,
  showuserdef: boolean,
): TemplateResult {
  const substations = getChildElementsByTagName(parent, 'Substation');

  return html` ${substations.map(
    Substation =>
      html`<substation-editor
        .element=${Substation}
        .editCount=${editCount}
        ?showfunctions=${showfunctions}
        ?showuserdef=${showuserdef}
      ></substation-editor>`,
  )}`;
}
