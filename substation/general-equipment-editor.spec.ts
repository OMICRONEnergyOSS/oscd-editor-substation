import { expect, fixture, html } from '@open-wc/testing';

import { SinonSpy, spy } from 'sinon';

import { isRemove } from '@omicronenergy/oscd-api/utils.js';

import { substationDoc } from '../substation.testfiles.js';

import './general-equipment-editor.js';
import type { GeneralEquipmentEditor } from './general-equipment-editor.js';

const eqFun = new DOMParser()
  .parseFromString(substationDoc, 'application/xml')
  .querySelector('GeneralEquipment')!;

describe('Component for SCL element GeneralEquipment ', () => {
  describe('with showfunctions = true', () => {
    let editor: GeneralEquipmentEditor;

    let eventSpy: SinonSpy;

    beforeEach(async () => {
      editor = await fixture(
        html`<general-equipment-editor
          .element="${eqFun}"
          ?showfunctions=${true}
        ></general-equipment-editor>`,
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
      expect(event.detail.element).to.equal(eqFun);
    });

    it('sends a wizard create request', () => {
      editor.addActionable?.forEach(add => {
        add.click();

        expect(eventSpy.callCount).to.equal(1);

        const event = eventSpy.args[0][0];
        expect(event.type).to.equal('oscd-create-wizard-request');
        expect(event.detail.parent).to.equal(eqFun);
        expect(event.detail.tagName).to.equal(add.value);

        eventSpy.resetHistory(); // individual select
      });
    });

    it('allows to remove an existing EqFunction element', () => {
      editor.removeActionable?.click();

      expect(eventSpy.callCount).to.equal(1);

      const event = eventSpy.args[0][0];

      expect(event.type).to.equal('oscd-edit');
      expect(event.detail).to.satisfy(isRemove);
      expect(event.detail.node).to.equal(eqFun);
    });
  });

  describe('with showfunctions = false', () => {
    let editor: GeneralEquipmentEditor;

    let eventSpy: SinonSpy;

    beforeEach(async () => {
      editor = await fixture(
        html`<general-equipment-editor
          .element="${eqFun}"
        ></general-equipment-editor>`,
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
      expect(event.detail.element).to.equal(eqFun);
    });

    it('allows to remove an existing EqFunction element', () => {
      editor.removeActionable?.click();

      expect(eventSpy.callCount).to.equal(1);

      const event = eventSpy.args[0][0];

      expect(event.type).to.equal('oscd-edit');
      expect(event.detail).to.satisfy(isRemove);
      expect(event.detail.node).to.equal(eqFun);
    });
  });
});
