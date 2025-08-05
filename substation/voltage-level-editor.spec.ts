import { expect, fixture, html } from '@open-wc/testing';

import { SinonSpy, spy } from 'sinon';

import { isRemove } from '@omicronenergy/oscd-api/utils.js';

import { substationDoc } from '../substation.testfiles.js';

import './voltage-level-editor.js';
import type { VoltageLevelEditor } from './voltage-level-editor.js';

const voltLv = new DOMParser()
  .parseFromString(substationDoc, 'application/xml')
  .querySelector('VoltageLevel[name="testVoltLv1"]')!;

describe('Component for SCL element Bay ', () => {
  let editor: VoltageLevelEditor;

  let eventSpy: SinonSpy;

  beforeEach(async () => {
    editor = await fixture(
      html`<voltage-level-editor
        .element="${voltLv}"
        ?showfunctions=${true}
      ></voltage-level-editor>`,
    );

    eventSpy = spy();
    window.addEventListener('oscd-edit-v2', eventSpy);
    window.addEventListener('oscd-edit-wizard-request', eventSpy);
    window.addEventListener('oscd-create-wizard-request', eventSpy);
  });

  it('sends a wizard edit request', () => {
    editor.editActionable?.click();

    expect(eventSpy.callCount).to.equal(1);

    const event = eventSpy.args[0][0];
    expect(event.type).to.equal('oscd-edit-wizard-request');
    expect(event.detail.element).to.equal(voltLv);
  });

  it('sends a wizard create request', () => {
    editor.addActionable?.forEach(add => {
      add.click();

      expect(eventSpy.callCount).to.equal(1);

      const event = eventSpy.args[0][0];
      expect(event.type).to.equal('oscd-create-wizard-request');
      expect(event.detail.parent).to.equal(voltLv);
      expect(event.detail.tagName).to.equal(add.value);

      eventSpy.resetHistory(); // individual select
    });
  });

  it('allows to remove an existing Bay element', () => {
    editor.removeActionable?.click();

    expect(eventSpy.callCount).to.equal(1);

    const event = eventSpy.args[0][0];

    expect(event.type).to.equal('oscd-edit-v2');
    expect(event.detail.edit).to.satisfy(isRemove);
    expect(event.detail.edit.node).to.equal(voltLv);
  });
});
