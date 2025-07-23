import { expect, fixture, html } from '@open-wc/testing';

import { SinonSpy, spy } from 'sinon';

import { isRemove } from '@omicronenergy/oscd-api/utils.js';

import { substationDoc } from '../substation.testfiles.js';

import './conducting-equipment-editor.js';
import type { ConductingEquipmentEditor } from './conducting-equipment-editor.js';

const condEq = new DOMParser()
  .parseFromString(substationDoc, 'application/xml')
  .querySelector('ConductingEquipment[name="QA1"]')!;

describe('Component for SCL element ConductingEquipment ', () => {
  describe('with showfunctions = true', () => {
    let editor: ConductingEquipmentEditor;

    let eventSpy: SinonSpy;

    beforeEach(async () => {
      editor = await fixture(
        html`<conducting-equipment-editor
          .element="${condEq}"
          ?showfunctions=${true}
        ></conducting-equipment-editor>`,
      );

      eventSpy = spy();
      window.addEventListener('oscd-edit', eventSpy);
      window.addEventListener('oscd-edit-wizard-request', eventSpy);
      window.addEventListener('oscd-create-wizard-request', eventSpy);
    });

    it('sends a wizard edit request', () => {
      editor.editActionable?.click();

      expect(eventSpy.callCount).to.equal(1);

      const event = eventSpy.args[0][0];
      expect(event.type).to.equal('oscd-edit-wizard-request');
      expect(event.detail.element).to.equal(condEq);
    });

    it('sends a wizard create request', () => {
      editor.addActionable?.forEach(add => {
        add.click();

        expect(eventSpy.callCount).to.equal(1);

        const event = eventSpy.args[0][0];
        expect(event.type).to.equal('oscd-create-wizard-request');
        expect(event.detail.parent).to.equal(condEq);
        expect(event.detail.tagName).to.equal(add.value);

        eventSpy.resetHistory(); // individual select
      });
    });

    it('allows to remove an existing ConductingEquipment element', () => {
      editor.removeActionable?.click();

      expect(eventSpy.callCount).to.equal(1);

      const event = eventSpy.args[0][0];

      expect(event.type).to.equal('oscd-edit');
      expect(event.detail).to.satisfy(isRemove);
      expect(event.detail.node).to.equal(condEq);
    });
  });

  describe('with showfunctions = false', () => {
    let editor: ConductingEquipmentEditor;

    let eventSpy: SinonSpy;

    beforeEach(async () => {
      editor = await fixture(
        html`<conducting-equipment-editor
          .element="${condEq}"
        ></conducting-equipment-editor>`,
      );

      eventSpy = spy();
      window.addEventListener('oscd-edit', eventSpy);
      window.addEventListener('oscd-edit-wizard-request', eventSpy);
    });

    it('sends a wizard edit request', () => {
      editor.editActionable?.click();

      expect(eventSpy.callCount).to.equal(1);

      const event = eventSpy.args[0][0];
      expect(event.type).to.equal('oscd-edit-wizard-request');
      expect(event.detail.element).to.equal(condEq);
    });

    it('allows to remove an existing ConductingEquipment element', () => {
      editor.removeActionable?.click();

      expect(eventSpy.callCount).to.equal(1);

      const event = eventSpy.args[0][0];

      expect(event.type).to.equal('oscd-edit');
      expect(event.detail).to.satisfy(isRemove);
      expect(event.detail.node).to.equal(condEq);
    });
  });
});
