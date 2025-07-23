import { TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@material/mwc-icon-button';
import '@openscd/oscd-action-icon';
import '@openscd/oscd-action-pane';
import { renderLNodes } from './l-node-editor.js';
import { renderEqFunctions } from './eq-function-editor.js';
import { renderText } from './text-editor.js';
import { renderPrivate } from './private-editor.js';

import { getChildElementsByTagName } from '../foundation.js';
import BaseSubstationElementEditor from './base-substation-element-editor.js';

/** [[`SubstationEditor`]] subeditor for a child-less `SubEquipment` element. */
@customElement('sub-equipment-editor')
export class SubEquipmentEditor extends BaseSubstationElementEditor {
  /** SubEquipment name attribute */
  @property({ type: String })
  get label(): string {
    const name = this.element.getAttribute('name');
    const desc = this.element.getAttribute('desc');
    const phase = this.element.getAttribute('phase');

    const description = `${desc ? ` - ${desc}` : ''}`;
    const phs = `${phase ? ` (${phase})` : ''}`;

    return `${name}${description}${phs}`;
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
      ${renderEqFunctions(this.element, this.editCount, this.showuserdef)}
    </oscd-action-pane> `;
  }

  static styles = css`
    abbr {
      text-decoration: none;
      border-bottom: none;
    }

    .container.lnode {
      display: grid;
      grid-gap: 12px;
      padding: 8px 12px 16px;
      box-sizing: border-box;
      grid-template-columns: repeat(auto-fit, minmax(64px, auto));
    }
  `;
}

export function renderSubEquipments(
  parent: Element,
  editCount: number,
  showfunctions: boolean,
  showuserdef: boolean,
): TemplateResult {
  const subEquipments = getChildElementsByTagName(parent, 'SubEquipment');

  return html` ${subEquipments.map(
    subEquipment =>
      html`<sub-equipment-editor
        .editCount=${editCount}
        .element=${subEquipment}
        ?showfunctions=${showfunctions}
        ?showuserdef=${showuserdef}
      ></sub-equipment-editor>`,
  )}`;
}
