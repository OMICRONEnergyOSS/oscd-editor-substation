import { expect, fixture, html } from '@open-wc/testing';

import { SinonSpy, spy } from 'sinon';

import { isRemove } from '@omicronenergy/oscd-api/utils.js';

import { substationDoc } from '../substation.testfiles.js';

import './sub-equipment-editor.js';
import type { SubEquipmentEditor } from './sub-equipment-editor.js';

const subEquip = new DOMParser()
  .parseFromString(substationDoc, 'application/xml')
  .querySelector('SubFunction')!;

describe('Component for SCL element SubEquipment', () => {
  let editor: SubEquipmentEditor;

  let eventSpy: SinonSpy;

  beforeEach(async () => {
    editor = await fixture(
      html`<sub-equipment-editor
        .element="${subEquip}"
      ></sub-equipment-editor>`,
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
    expect(event.detail.element).to.equal(subEquip);
  });

  it('sends a wizard create request', () => {
    editor.addActionable?.forEach(add => {
      add.click();

      expect(eventSpy.callCount).to.equal(1);

      const event = eventSpy.args[0][0];
      expect(event.type).to.equal('oscd-create-wizard-request');
      expect(event.detail.parent).to.equal(subEquip);
      expect(event.detail.tagName).to.equal(add.value);

      eventSpy.resetHistory(); // individual select
    });
  });

  it('allows to remove an existing SubEquipment element', () => {
    editor.removeActionable?.click();

    expect(eventSpy.callCount).to.equal(1);

    const event = eventSpy.args[0][0];

    expect(event.type).to.equal('oscd-edit');
    expect(event.detail).to.satisfy(isRemove);
    expect(event.detail.node).to.equal(subEquip);
  });
});
