/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import '@openscd/oscd-action-pane';
import { renderConductingEquipments } from './conducting-equipment-editor.js';
import { renderFunctions } from './function-editor.js';
import { renderGeneralEquipment } from './general-equipment-editor.js';
import { renderLines } from './line-editor.js';
import { renderLNodes } from './l-node-editor.js';
import { renderSubstations } from './substation-editor.js';

import { styles } from '../foundation.js';

@customElement('process-editor')
export class ProcessEditor extends LitElement {
  /** The document being edited as provided to editor by [[`Zeroline`]]. */
  @property({ attribute: false })
  doc!: XMLDocument;

  @property({ type: Number })
  editCount = -1;

  /** SCL element Process */
  @property({ attribute: false })
  element!: Element;

  /** Whether `Function` and `LNode` are rendered */
  @property({ type: Boolean })
  showfunctions = false;

  @state()
  get header(): string {
    const name = this.element.getAttribute('name') ?? '';
    const desc = this.element.getAttribute('desc');

    return `${name} ${desc ? `—${desc}` : ''}`;
  }

  render(): TemplateResult {
    return html`<oscd-action-pane label=${this.header}>
      ${renderConductingEquipments(
        this.element,
        this.editCount,
        this.showfunctions
      )}
      ${renderGeneralEquipment(
        this.element,
        this.editCount,
        this.showfunctions
      )}
      ${renderFunctions(this.element, this.editCount, this.showfunctions)}
      ${renderLNodes(this.element, this.editCount, this.showfunctions)}
      ${renderLines(this.element, this.editCount, this.showfunctions)}
      ${renderSubstations(this.element, this.editCount, this.showfunctions)}
      ${renderProcesses(this.element, this.editCount, this.showfunctions)}
    </oscd-action-pane>`;
  }

  static styles = css`
    ${styles}

    :host(.moving) {
      opacity: 0.3;
    }

    abbr {
      text-decoration: none;
      border-bottom: none;
    }
  `;
}

export function renderProcesses(
  parent: Element,
  editCount: number,
  showfunctions: boolean
): TemplateResult {
  const processes = parent.querySelectorAll(':root > Process');

  return processes.length
    ? html`<section>
        ${Array.from(processes).map(
          process =>
            html`<process-editor
              .element=${process}
              .editCount=${editCount}
              ?showfunctions=${showfunctions}
            ></process-editor>`
        )}
      </section>`
    : html``;
}
