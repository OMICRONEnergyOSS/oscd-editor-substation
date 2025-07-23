import { TemplateResult, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@material/mwc-fab';
import '@material/mwc-icon-button';
import '@openscd/oscd-action-icon';
import '@openscd/oscd-action-pane';
import './transformer-winding-editor.js';
import { renderLNodes } from './l-node-editor.js';
import { renderEqFunctions } from './eq-function-editor.js';
import { renderSubEquipments } from './sub-equipment-editor.js';
import { renderText } from './text-editor.js';
import { renderPrivate } from './private-editor.js';

import {
  getChildElementsByTagName,
  powerTransformerTwoWindingIcon,
  styles,
} from '../foundation.js';
import BaseSubstationElementEditor from './base-substation-element-editor.js';

/** [[`SubstationEditor`]] subeditor for a child-less `PowerTransformer` element. */
@customElement('power-transformer-editor')
export class PowerTransformerEditor extends BaseSubstationElementEditor {
  /** PowerTransformer name attribute */
  @property({ type: String })
  get name(): string {
    return `${this.element.getAttribute('name')}`;
  }

  // eslint-disable-next-line class-methods-use-this
  renderContentPane(): TemplateResult {
    return html`<mwc-icon slot="icon" style="width:24px;height:24px"
      >${powerTransformerTwoWindingIcon}</mwc-icon
    > `;
  }

  private renderTransformerWinding(): TemplateResult {
    const transformerWindings = getChildElementsByTagName(
      this.element,
      'TransformerWinding',
    );

    return html`${transformerWindings.map(
      transformerWinding =>
        html`<transformer-winding-editor
          .element=${transformerWinding}
          .editCount=${this.editCount}
          ?showfunctions=${this.showfunctions}
          ?showuserdef=${this.showuserdef}
        ></transformer-winding-editor>`,
    )}`;
  }

  renderContentIcon(): TemplateResult {
    return html`<mwc-icon slot="icon"
        >${powerTransformerTwoWindingIcon}</mwc-icon
      ><mwc-fab
        class="action edit"
        slot="action"
        mini
        icon="edit"
        @click="${() => this.openEditWizard()}"
      ></mwc-fab>
      <mwc-fab
        class="action remove"
        slot="action"
        mini
        icon="delete"
        @click="${() => this.removeElement()}"
      ></mwc-fab> `;
  }

  render(): TemplateResult {
    if (this.showfunctions)
      return html`<oscd-action-pane label="${this.name}">
        <abbr slot="action" title="Edit">
          <mwc-icon-button
            class="action edit"
            icon="edit"
            @click=${() => this.openEditWizard()}
          ></mwc-icon-button>
        </abbr>
        <abbr slot="action" title="Remove">
          <mwc-icon-button
            class="action edit"
            icon="delete"
            @click=${() => this.removeElement()}
          ></mwc-icon-button>
        </abbr>
        ${this.renderAddButton()} ${this.renderContentPane()}
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
        ${this.renderTransformerWinding()}
        ${renderEqFunctions(this.element, this.editCount, this.showuserdef)}
        ${renderSubEquipments(
          this.element,
          this.editCount,
          this.showfunctions,
          this.showuserdef,
        )}
      </oscd-action-pane> `;

    return html`<oscd-action-icon label="${this.name}"
      >${this.renderContentIcon()}</oscd-action-icon
    > `;
  }

  static styles = css`
    ${styles}

    abbr {
      text-decoration: none;
      border-bottom: none;
    }
  `;
}

export function renderPowerTransformerContainer(
  parent: Element,
  editCount: number,
  showfunctions: boolean,
  showuserdef: boolean,
): TemplateResult {
  const pTrans = getChildElementsByTagName(parent, 'PowerTransformer');

  if (showfunctions)
    return html`${pTrans.map(
      ptr =>
        html`<power-transformer-editor
          .element=${ptr}
          .editCount=${editCount}
          ?showfunctions=${showfunctions}
          ?showuserdef=${showuserdef}
        ></power-transformer-editor>`,
    )}`;

  return pTrans.length
    ? html`<div class="content actionicon">
        ${pTrans.map(
          pwt =>
            html`<power-transformer-editor
              .element=${pwt}
              .editCount=${editCount}
              ?showfunctions=${showfunctions}
              ?showuserdef=${showuserdef}
            ></power-transformer-editor>`,
        )}
      </div>`
    : html``;
}
