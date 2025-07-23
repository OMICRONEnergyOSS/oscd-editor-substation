import { TemplateResult, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '@material/mwc-fab';
import '@material/mwc-icon-button';

import '@openscd/oscd-action-pane';

import { getChildElementsByTagName } from '../foundation.js';
import BaseSubstationElementEditor from './base-substation-element-editor.js';

@customElement('text-editor')
export class TextEditor extends BaseSubstationElementEditor {
  @state()
  get header(): string {
    const content = this.element.textContent;

    return `${content}`;
  }

  render(): TemplateResult {
    return html`<oscd-action-pane
      label="${this.header}"
      icon="notes"
      secondary
      highlighted
    >
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
    </oscd-action-pane>`;
  }

  static styles = css`
    abbr {
      text-decoration: none;
      border-bottom: none;
    }
  `;
}

export function renderText(
  parent: Element,
  editCount: number,
  showfunctions: boolean,
  showuserdef: boolean,
): TemplateResult {
  if (!showfunctions) return html``;
  if (!showuserdef) return html``;

  const text = getChildElementsByTagName(parent, 'Text');
  return html`${text.map(
    fText =>
      html`<text-editor
        .editCount=${editCount}
        .element=${fText}
        ?showfunctions=${showfunctions}
        ?showuserdef=${showuserdef}
      ></text-editor>`,
  )}`;
}
