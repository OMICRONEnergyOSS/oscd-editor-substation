import { TemplateResult, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '@material/mwc-fab';
import '@material/mwc-icon';
import '@openscd/oscd-action-icon';

import {
  automationLogicalNode,
  controlLogicalNode,
  functionalLogicalNode,
  furtherPowerSystemEquipmentLogicalNode,
  generalLogicalNode,
  interfacingLogicalNode,
  measurementLogicalNode,
  nonElectricalLogicalNode,
  powerTransformerLogicalNode,
  protectionLogicalNode,
  protectionRelatedLogicalNode,
  qualityLogicalNode,
  supervisionLogicalNode,
  switchgearLogicalNode,
  systemLogicalNode,
  transformerLogicalNode,
} from './lnode.js';
import { getChildElementsByTagName } from '../foundation.js';
import BaseSubstationElementEditor from './base-substation-element-editor.js';

const lnClassIcons: Partial<Record<string, TemplateResult>> = {
  L: systemLogicalNode,
  A: automationLogicalNode,
  C: controlLogicalNode,
  F: functionalLogicalNode,
  G: generalLogicalNode,
  I: interfacingLogicalNode,
  K: nonElectricalLogicalNode,
  M: measurementLogicalNode,
  P: protectionLogicalNode,
  Q: qualityLogicalNode,
  R: protectionRelatedLogicalNode,
  S: supervisionLogicalNode,
  T: transformerLogicalNode,
  X: switchgearLogicalNode,
  Y: powerTransformerLogicalNode,
  Z: furtherPowerSystemEquipmentLogicalNode,
};

export function getLNodeIcon(lNode: Element): TemplateResult {
  const lnClassGroup = lNode.getAttribute('lnClass')?.charAt(0) ?? '';
  return lnClassIcons[lnClassGroup] ?? systemLogicalNode;
}

/** Pane rendering `LNode` element with its children */
@customElement('l-node-editor')
export class LNodeEditor extends BaseSubstationElementEditor {
  @state()
  private get header(): string {
    const prefix = this.element.getAttribute('prefix') ?? '';
    const lnClass = this.element.getAttribute('lnClass');
    const lnInst = this.element.getAttribute('lnInst');

    return `${prefix} ${lnClass} ${lnInst}`;
  }

  @state()
  private get missingIedReference(): boolean {
    return this.element.getAttribute('iedName') === 'None';
  }

  render(): TemplateResult {
    return html`<oscd-action-icon
      label="${this.header}"
      ?secondary=${this.missingIedReference}
      ?highlighted=${this.missingIedReference}
      ><mwc-icon slot="icon">${getLNodeIcon(this.element)}</mwc-icon>
      <mwc-fab
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
      ></mwc-fab>
    </oscd-action-icon>`;
  }
}

export function renderLNodes(
  parent: Element,
  editCount: number,
  showfunctions: boolean,
): TemplateResult {
  if (!showfunctions) return html``;

  const lNodes = getChildElementsByTagName(parent, 'LNode');

  return lNodes.length
    ? html`<div class="container lnode">
        ${lNodes.map(
          lNode =>
            html`<l-node-editor
              .editCount=${editCount}
              .element=${lNode}
            ></l-node-editor>`,
        )}
      </div>`
    : html``;
}
